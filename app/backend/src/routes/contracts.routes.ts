import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { CONTRACT_TYPES } from "../domain.js";
import { signatureProvider } from "../utils/signature.js";

export const contractsRouter = Router();

const createContractSchema = z.object({
  offerId: z.string().min(1),
  organizationId: z.string().optional(),
  type: z.enum(CONTRACT_TYPES).default("TRANSPORT"),
  terms: z.string().optional(),
});

async function logEvent(contractId: string, type: string, data?: unknown) {
  await prisma.contractEvent.create({
    data: { contractId, type, data: data === undefined ? null : JSON.stringify(data) },
  });
}

// Generates a contract from an ACCEPTED offer. Only the mission owner
// (donneur d'ordre) can trigger this — matching the cahier des charges
// contract workflow: "modèle → préremplissage → conditions → devis →
// acceptation → signature".
contractsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createContractSchema.parse(req.body);

    const offer = await prisma.missionOffer.findUnique({
      where: { id: body.offerId },
      include: { mission: true },
    });
    if (!offer) throw new ApiError(404, "OFFER_NOT_FOUND");
    if (offer.mission.ownerId !== req.user!.id) {
      throw new ApiError(403, "FORBIDDEN", "Seul le donneur d'ordre peut générer le contrat.");
    }
    if (offer.status !== "ACCEPTED") {
      throw new ApiError(409, "OFFER_NOT_ACCEPTED", "Le contrat ne peut être généré qu'à partir d'une offre acceptée.");
    }

    const existing = await prisma.contract.findFirst({
      where: { missionId: offer.missionId, status: { not: "CANCELLED" } },
    });
    if (existing) {
      throw new ApiError(409, "CONTRACT_ALREADY_EXISTS");
    }

    const contract = await prisma.contract.create({
      data: {
        missionId: offer.missionId,
        organizationId: body.organizationId,
        ownerId: offer.mission.ownerId,
        counterpartyId: offer.providerId,
        type: body.type,
        price: offer.price,
        terms: body.terms,
        status: "SENT",
      },
    });
    await logEvent(contract.id, "CREATED", { price: contract.price });

    res.status(201).json({ contract });
  }),
);

contractsRouter.get(
  "/mine",
  requireAuth,
  asyncHandler(async (req, res) => {
    const contracts = await prisma.contract.findMany({
      where: { OR: [{ ownerId: req.user!.id }, { counterpartyId: req.user!.id }] },
      orderBy: { createdAt: "desc" },
    });
    res.json({ contracts });
  }),
);

async function requireParty(contractId: string, userId: string) {
  const contract = await prisma.contract.findUnique({ where: { id: contractId } });
  if (!contract) throw new ApiError(404, "CONTRACT_NOT_FOUND");
  if (contract.ownerId !== userId && contract.counterpartyId !== userId) {
    throw new ApiError(403, "FORBIDDEN");
  }
  return contract;
}

contractsRouter.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const contract = await requireParty(req.params.id, req.user!.id);
    res.json({ contract });
  }),
);

// Internal click-to-sign — see src/utils/signature.ts for the legal caveat.
contractsRouter.post(
  "/:id/sign",
  requireAuth,
  asyncHandler(async (req, res) => {
    const contract = await requireParty(req.params.id, req.user!.id);
    if (contract.status === "FULLY_SIGNED" || contract.status === "CANCELLED") {
      throw new ApiError(409, "CONTRACT_NOT_SIGNABLE");
    }

    const isOwner = contract.ownerId === req.user!.id;
    const alreadySigned = isOwner ? contract.ownerSignedAt : contract.counterpartySignedAt;
    if (alreadySigned) {
      throw new ApiError(409, "ALREADY_SIGNED");
    }

    const { signedAt } = await signatureProvider.sign({ contractId: contract.id, signerId: req.user!.id });

    const otherPartySigned = isOwner ? contract.counterpartySignedAt : contract.ownerSignedAt;
    const willBeFullySigned = Boolean(otherPartySigned);

    const updated = await prisma.contract.update({
      where: { id: contract.id },
      data: {
        ...(isOwner ? { ownerSignedAt: signedAt } : { counterpartySignedAt: signedAt }),
        status: willBeFullySigned ? "FULLY_SIGNED" : "PARTIALLY_SIGNED",
      },
    });
    await logEvent(contract.id, isOwner ? "SIGNED_BY_OWNER" : "SIGNED_BY_COUNTERPARTY", { signedAt });

    if (willBeFullySigned) {
      await prisma.mission.update({ where: { id: contract.missionId }, data: { status: "CONFIRMED" } });
      await logEvent(contract.id, "FULLY_SIGNED", { signedAt });
    }

    res.json({ contract: updated });
  }),
);
