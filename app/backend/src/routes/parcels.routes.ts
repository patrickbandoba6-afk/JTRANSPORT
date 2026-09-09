import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { ORGANIZATION_MEMBER_ROLES, INCIDENT_STATUSES } from "../domain.js";
import { newParcelCode } from "../utils/parcelCode.js";

export const parcelsRouter = Router();

// --- access helpers ---------------------------------------------------

// Everything below hangs off organization membership: dispatch, logistics
// and driving are roles inside a company, never standalone accounts.
async function membershipOrThrow(organizationId: string, userId: string, allowed: readonly string[]) {
  const organization = await prisma.organization.findUnique({ where: { id: organizationId } });
  if (!organization) throw new ApiError(404, "ORGANIZATION_NOT_FOUND");

  if (organization.ownerId === userId) return { organization, role: "ADMINISTRATEUR" as const };

  const member = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId, userId } },
  });
  if (!member || !allowed.includes(member.role)) throw new ApiError(403, "FORBIDDEN");
  return { organization, role: member.role };
}

async function actorLabel(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, role: true } });
  return user ? `${user.name} (${user.role})` : userId;
}

// The only way a parcel's history grows. Never update or delete an event:
// a correction is itself an event.
async function recordEvent(input: {
  parcelId: string;
  type: string;
  actorId?: string;
  location?: string;
  proof?: unknown;
  note?: string;
}) {
  await prisma.parcelEvent.create({
    data: {
      parcelId: input.parcelId,
      type: input.type,
      actorId: input.actorId,
      actorLabel: input.actorId ? await actorLabel(input.actorId) : undefined,
      location: input.location,
      proof: input.proof === undefined ? undefined : JSON.stringify(input.proof),
      note: input.note,
    },
  });
}

// --- company side -----------------------------------------------------

const createParcelsSchema = z.object({
  organizationId: z.string().min(1),
  parcels: z
    .array(
      z.object({
        code: z.string().min(3).optional(),
        description: z.string().min(1),
        weightKg: z.coerce.number().positive(),
        recipientName: z.string().optional(),
        recipientAddress: z.string().optional(),
        declaredValue: z.coerce.number().positive().optional(),
      }),
    )
    .min(1)
    .max(500),
});

parcelsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createParcelsSchema.parse(req.body);
    await membershipOrThrow(body.organizationId, req.user!.id, [
      "ADMINISTRATEUR",
      "RESPONSABLE_LOGISTIQUE",
      "OPERATEUR",
      "DISPATCHER",
    ]);

    const created = [];
    for (const p of body.parcels) {
      const parcel = await prisma.parcel.create({
        data: {
          code: p.code ?? newParcelCode(),
          organizationId: body.organizationId,
          description: p.description,
          weightKg: p.weightKg,
          recipientName: p.recipientName,
          recipientAddress: p.recipientAddress,
          declaredValue: p.declaredValue,
          status: "READY_TO_DISPATCH",
          custodianType: "ORGANIZATION",
          custodianOrgId: body.organizationId,
        },
      });
      await recordEvent({ parcelId: parcel.id, type: "CREATED", actorId: req.user!.id });
      await recordEvent({ parcelId: parcel.id, type: "READY_TO_DISPATCH", actorId: req.user!.id });
      created.push(parcel);
    }

    res.status(201).json({ parcels: created });
  }),
);

parcelsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const query = z
      .object({ organizationId: z.string().min(1), status: z.string().optional() })
      .parse(req.query);
    await membershipOrThrow(query.organizationId, req.user!.id, [...ORGANIZATION_MEMBER_ROLES]);

    const parcels = await prisma.parcel.findMany({
      where: { organizationId: query.organizationId, ...(query.status ? { status: query.status } : {}) },
      orderBy: { code: "asc" },
      include: { round: { select: { id: true, reference: true } } },
    });
    res.json({ parcels });
  }),
);

// Hands a batch of parcels over to a carrier round. This is a transfer of
// responsibility, so it is written as an event on every parcel — the
// company can prove later exactly what it handed over, and to whom.
const assignSchema = z.object({
  roundId: z.string().min(1),
  parcelIds: z.array(z.string().min(1)).min(1),
});

parcelsRouter.post(
  "/assign",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = assignSchema.parse(req.body);
    const round = await prisma.deliveryRound.findUnique({ where: { id: body.roundId } });
    if (!round) throw new ApiError(404, "ROUND_NOT_FOUND");
    if (!round.organizationId) throw new ApiError(409, "ROUND_WITHOUT_ORGANIZATION");
    await membershipOrThrow(round.organizationId, req.user!.id, ["ADMINISTRATEUR", "RESPONSABLE_LOGISTIQUE", "DISPATCHER"]);

    const parcels = await prisma.parcel.findMany({ where: { id: { in: body.parcelIds } } });
    if (parcels.length !== body.parcelIds.length) throw new ApiError(404, "PARCEL_NOT_FOUND");
    const foreign = parcels.find((p) => p.organizationId !== round.organizationId);
    if (foreign) throw new ApiError(403, "PARCEL_NOT_OWNED_BY_ORGANIZATION");
    const alreadyGone = parcels.find((p) => p.status !== "READY_TO_DISPATCH" && p.status !== "CREATED");
    if (alreadyGone) {
      throw new ApiError(409, "PARCEL_NOT_ASSIGNABLE", `Le colis ${alreadyGone.code} n'est plus disponible au dispatch.`);
    }

    for (const parcel of parcels) {
      await prisma.parcel.update({
        where: { id: parcel.id },
        data: {
          roundId: round.id,
          status: "ASSIGNED",
          custodianType: "CARRIER",
          custodianOrgId: round.carrierOrgId ?? undefined,
          custodianUserId: round.driverId ?? undefined,
        },
      });
      await recordEvent({
        parcelId: parcel.id,
        type: "ASSIGNED_TO_CARRIER",
        actorId: req.user!.id,
        note: `Tournée ${round.reference}`,
      });
    }

    res.json({ assigned: parcels.length, roundId: round.id });
  }),
);

// --- carrier / driver side --------------------------------------------

// The carrier physically takes the parcel: scanning its code is what
// moves custody, not a checkbox on a list.
parcelsRouter.post(
  "/scan",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = z
      .object({ code: z.string().min(1), location: z.string().optional() })
      .parse(req.body);

    const parcel = await prisma.parcel.findUnique({ where: { code: body.code }, include: { round: true } });
    if (!parcel) throw new ApiError(404, "PARCEL_NOT_FOUND");
    if (!parcel.round) throw new ApiError(409, "PARCEL_NOT_ASSIGNED", "Ce colis n'est rattaché à aucune tournée.");
    if (parcel.round.driverId !== req.user!.id) {
      throw new ApiError(403, "FORBIDDEN", "Ce colis n'est pas sur votre tournée.");
    }
    if (parcel.status === "DELIVERED" || parcel.status === "RETURNED") {
      throw new ApiError(409, "PARCEL_ALREADY_CLOSED");
    }

    const updated = await prisma.parcel.update({
      where: { id: parcel.id },
      data: { status: "PICKED_UP", custodianType: "DRIVER", custodianUserId: req.user!.id },
    });
    await recordEvent({
      parcelId: parcel.id,
      type: "PICKED_UP",
      actorId: req.user!.id,
      location: body.location,
      proof: { scannedCode: body.code },
    });

    res.json({ parcel: updated });
  }),
);

const deliverSchema = z.object({
  code: z.string().min(1),
  recipientName: z.string().optional(),
  signature: z.string().max(200000).optional(),
  photoRef: z.string().optional(),
  location: z.string().optional(),
  note: z.string().max(500).optional(),
});

parcelsRouter.post(
  "/deliver",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = deliverSchema.parse(req.body);
    const parcel = await prisma.parcel.findUnique({ where: { code: body.code }, include: { round: true } });
    if (!parcel) throw new ApiError(404, "PARCEL_NOT_FOUND");
    if (parcel.round?.driverId !== req.user!.id) throw new ApiError(403, "FORBIDDEN");
    if (parcel.status === "DELIVERED") throw new ApiError(409, "ALREADY_DELIVERED");
    if (!body.signature && !body.photoRef) {
      throw new ApiError(400, "PROOF_REQUIRED", "Une preuve de livraison (signature ou photo) est obligatoire.");
    }

    const updated = await prisma.parcel.update({
      where: { id: parcel.id },
      data: { status: "DELIVERED", custodianType: "RECIPIENT", custodianUserId: null },
    });
    await recordEvent({
      parcelId: parcel.id,
      type: "DELIVERED",
      actorId: req.user!.id,
      location: body.location,
      note: body.note,
      proof: { recipientName: body.recipientName, signature: Boolean(body.signature), photoRef: body.photoRef },
    });

    res.json({ parcel: updated });
  }),
);

const failSchema = z.object({
  code: z.string().min(1),
  reason: z.string().min(1).max(300),
  location: z.string().optional(),
  returned: z.boolean().optional(),
});

// A failed delivery always needs a stated reason, and the attempt itself is
// recorded — the driver can't quietly drop a parcel off the list.
parcelsRouter.post(
  "/delivery-failed",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = failSchema.parse(req.body);
    const parcel = await prisma.parcel.findUnique({ where: { code: body.code }, include: { round: true } });
    if (!parcel) throw new ApiError(404, "PARCEL_NOT_FOUND");
    if (parcel.round?.driverId !== req.user!.id) throw new ApiError(403, "FORBIDDEN");

    await recordEvent({
      parcelId: parcel.id,
      type: "DELIVERY_ATTEMPT",
      actorId: req.user!.id,
      location: body.location,
      note: body.reason,
    });

    const updated = await prisma.parcel.update({
      where: { id: parcel.id },
      data: body.returned
        ? { status: "RETURNED", custodianType: "ORGANIZATION", custodianOrgId: parcel.organizationId ?? undefined, custodianUserId: null }
        : { status: "IN_DELIVERY" },
    });
    if (body.returned) {
      await recordEvent({ parcelId: parcel.id, type: "RETURNED", actorId: req.user!.id, note: body.reason });
    }

    res.json({ parcel: updated });
  }),
);

// --- traceability -----------------------------------------------------

parcelsRouter.get(
  "/:code/trace",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parcel = await prisma.parcel.findUnique({
      where: { code: req.params.code },
      include: {
        events: { orderBy: { createdAt: "asc" } },
        incidents: { orderBy: { createdAt: "asc" } },
        round: { select: { id: true, reference: true, driverId: true, carrierOrgId: true } },
      },
    });
    if (!parcel) throw new ApiError(404, "PARCEL_NOT_FOUND");

    const isDriver = parcel.round?.driverId === req.user!.id;
    let isCompany = false;
    if (parcel.organizationId) {
      try {
        await membershipOrThrow(parcel.organizationId, req.user!.id, [...ORGANIZATION_MEMBER_ROLES]);
        isCompany = true;
      } catch {
        isCompany = false;
      }
    }
    if (!isDriver && !isCompany && req.user!.role !== "ADMIN") throw new ApiError(403, "FORBIDDEN");

    res.json({ parcel });
  }),
);

// Reconciliation: what a carrier was handed vs what they accounted for.
// Any gap opens a NON_LOCALISE incident — never a theft accusation.
parcelsRouter.post(
  "/reconcile",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { roundId } = z.object({ roundId: z.string().min(1) }).parse(req.body);
    const round = await prisma.deliveryRound.findUnique({ where: { id: roundId } });
    if (!round) throw new ApiError(404, "ROUND_NOT_FOUND");
    if (!round.organizationId) throw new ApiError(409, "ROUND_WITHOUT_ORGANIZATION");
    await membershipOrThrow(round.organizationId, req.user!.id, ["ADMINISTRATEUR", "RESPONSABLE_LOGISTIQUE", "DISPATCHER"]);

    const parcels = await prisma.parcel.findMany({ where: { roundId: round.id }, include: { incidents: true } });
    const delivered = parcels.filter((p) => p.status === "DELIVERED");
    const returned = parcels.filter((p) => p.status === "RETURNED");
    const unaccounted = parcels.filter(
      (p) => p.status !== "DELIVERED" && p.status !== "RETURNED" && p.status !== "INCIDENT",
    );

    for (const parcel of unaccounted) {
      await prisma.incident.create({
        data: {
          parcelId: parcel.id,
          status: "NON_LOCALISE",
          reason: `Colis non justifié à la clôture de la tournée ${round.reference}`,
          openedById: req.user!.id,
        },
      });
      await prisma.parcel.update({ where: { id: parcel.id }, data: { status: "INCIDENT" } });
      await recordEvent({
        parcelId: parcel.id,
        type: "INCIDENT_OPENED",
        actorId: req.user!.id,
        note: "Colis non localisé à la réconciliation",
      });
    }

    res.json({
      reconciliation: {
        handedOver: parcels.length,
        delivered: delivered.length,
        returned: returned.length,
        unaccounted: unaccounted.length,
        incidentsOpened: unaccounted.length,
      },
    });
  }),
);

// --- incidents --------------------------------------------------------

parcelsRouter.post(
  "/:code/incidents",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = z.object({ reason: z.string().min(1).max(300), status: z.enum(INCIDENT_STATUSES).optional() }).parse(req.body);
    const parcel = await prisma.parcel.findUnique({ where: { code: req.params.code }, include: { round: true } });
    if (!parcel) throw new ApiError(404, "PARCEL_NOT_FOUND");

    const isDriver = parcel.round?.driverId === req.user!.id;
    if (!isDriver && parcel.organizationId) {
      await membershipOrThrow(parcel.organizationId, req.user!.id, [...ORGANIZATION_MEMBER_ROLES]);
    }

    // A driver can report, but never self-declare a theft.
    const status = body.status ?? "SIGNALE";
    if (isDriver && status === "VOL_CONFIRME") throw new ApiError(403, "FORBIDDEN");

    const incident = await prisma.incident.create({
      data: { parcelId: parcel.id, status, reason: body.reason, openedById: req.user!.id },
    });
    await prisma.parcel.update({ where: { id: parcel.id }, data: { status: "INCIDENT" } });
    await recordEvent({ parcelId: parcel.id, type: "INCIDENT_OPENED", actorId: req.user!.id, note: body.reason });

    res.status(201).json({ incident });
  }),
);

// Only the owning company can escalate or close an incident — and even a
// confirmed theft is an explicit human decision, recorded as such.
parcelsRouter.patch(
  "/incidents/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = z
      .object({ status: z.enum(INCIDENT_STATUSES), resolution: z.string().max(500).optional() })
      .parse(req.body);
    const incident = await prisma.incident.findUnique({ where: { id: req.params.id }, include: { parcel: true } });
    if (!incident) throw new ApiError(404, "INCIDENT_NOT_FOUND");
    if (incident.parcel.organizationId) {
      await membershipOrThrow(incident.parcel.organizationId, req.user!.id, ["ADMINISTRATEUR", "RESPONSABLE_LOGISTIQUE"]);
    }

    const updated = await prisma.incident.update({
      where: { id: incident.id },
      data: {
        status: body.status,
        resolution: body.resolution,
        resolvedAt: body.status === "RESOLU" ? new Date() : null,
      },
    });
    await recordEvent({
      parcelId: incident.parcelId,
      type: body.status === "RESOLU" ? "INCIDENT_RESOLVED" : "INCIDENT_UPDATED",
      actorId: req.user!.id,
      note: `${body.status}${body.resolution ? ` — ${body.resolution}` : ""}`,
    });

    res.json({ incident: updated });
  }),
);
