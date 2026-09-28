import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { DISPUTE_CATEGORIES, DISPUTE_STATUSES } from "../domain.js";

export const disputesRouter = Router();

const createDisputeSchema = z.object({
  contractId: z.string().min(1),
  category: z.enum(DISPUTE_CATEGORIES),
  description: z.string().min(1),
});

const messageSchema = z.object({
  body: z.string().min(1),
  attachmentUrl: z.string().optional(),
});

// Admin-only: resolution/refund is a recorded decision, never inferred
// automatically from the messages.
const resolveSchema = z.object({
  status: z.enum(DISPUTE_STATUSES),
  resolution: z.string().optional(),
  refundAmount: z.coerce.number().positive().optional(),
});

async function requireContractParty(contractId: string, userId: string) {
  const contract = await prisma.contract.findUnique({ where: { id: contractId } });
  if (!contract) throw new ApiError(404, "CONTRACT_NOT_FOUND");
  if (contract.ownerId !== userId && contract.counterpartyId !== userId) {
    throw new ApiError(403, "FORBIDDEN", "Seules les parties au contrat peuvent ouvrir un litige.");
  }
  return contract;
}

async function requireDisputeParty(disputeId: string, userId: string, role: string) {
  const dispute = await prisma.dispute.findUnique({ where: { id: disputeId }, include: { contract: true } });
  if (!dispute) throw new ApiError(404, "DISPUTE_NOT_FOUND");
  const isParty = dispute.contract.ownerId === userId || dispute.contract.counterpartyId === userId;
  if (!isParty && role !== "ADMIN") throw new ApiError(403, "FORBIDDEN");
  return dispute;
}

disputesRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createDisputeSchema.parse(req.body);
    await requireContractParty(body.contractId, req.user!.id);

    const dispute = await prisma.dispute.create({
      data: {
        contractId: body.contractId,
        openedById: req.user!.id,
        category: body.category,
        description: body.description,
      },
    });

    res.status(201).json({ dispute });
  }),
);

disputesRouter.get(
  "/mine",
  requireAuth,
  asyncHandler(async (req, res) => {
    const disputes = await prisma.dispute.findMany({
      where: {
        contract: { OR: [{ ownerId: req.user!.id }, { counterpartyId: req.user!.id }] },
      },
      include: { contract: true, _count: { select: { messages: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ disputes });
  }),
);

disputesRouter.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const dispute = await requireDisputeParty(req.params.id, req.user!.id, req.user!.role);
    const full = await prisma.dispute.findUnique({
      where: { id: dispute.id },
      include: {
        contract: true,
        messages: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: "asc" } },
      },
    });
    res.json({ dispute: full });
  }),
);

disputesRouter.post(
  "/:id/messages",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = messageSchema.parse(req.body);
    const dispute = await requireDisputeParty(req.params.id, req.user!.id, req.user!.role);
    if (dispute.status === "CLOSED") throw new ApiError(409, "DISPUTE_CLOSED");

    const message = await prisma.disputeMessage.create({
      data: { disputeId: dispute.id, authorId: req.user!.id, body: body.body, attachmentUrl: body.attachmentUrl },
    });
    res.status(201).json({ message });
  }),
);

// Resolution is always an explicit admin decision — never automatic, and
// a refund here only records the decision; the actual money movement goes
// through /api/payments/:id/refunds against the related invoice/payment.
disputesRouter.post(
  "/:id/resolve",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const body = resolveSchema.parse(req.body);
    const dispute = await prisma.dispute.findUnique({ where: { id: req.params.id } });
    if (!dispute) throw new ApiError(404, "DISPUTE_NOT_FOUND");

    const updated = await prisma.dispute.update({
      where: { id: dispute.id },
      data: {
        status: body.status,
        resolution: body.resolution,
        refundAmount: body.refundAmount,
        resolvedAt: ["RESOLVED", "REJECTED", "CLOSED"].includes(body.status) ? new Date() : null,
      },
    });
    res.json({ dispute: updated });
  }),
);
