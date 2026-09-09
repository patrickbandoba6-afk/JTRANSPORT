import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { ORGANIZATION_MEMBER_ROLES } from "../domain.js";
import { membershipOrThrow, isMemberOf } from "../utils/membership.js";

export const roundsRouter = Router();

const DISPATCH_ROLES = ["ADMINISTRATEUR", "RESPONSABLE_LOGISTIQUE", "DISPATCHER"] as const;

const stopInputSchema = z.object({
  label: z.string().min(1),
  address: z.string().min(1),
  parcelCode: z.string().optional(),
  recipient: z.string().optional(),
});

const createRoundSchema = z.object({
  organizationId: z.string().min(1),
  date: z.coerce.date(),
  stops: z.array(stopInputSchema).default([]),
});

async function nextRoundReference(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.deliveryRound.count({ where: { reference: { startsWith: `TRN-${year}-` } } });
  return `TRN-${year}-${String(count + 1).padStart(4, "0")}`;
}

async function loadRoundForDriver(roundId: string, userId: string) {
  const round = await prisma.deliveryRound.findUnique({ where: { id: roundId } });
  if (!round) throw new ApiError(404, "ROUND_NOT_FOUND");
  if (round.driverId !== userId) {
    throw new ApiError(403, "FORBIDDEN", "Cette tournée n'est pas assignée à votre compte.");
  }
  return round;
}

async function refreshRoundStatus(roundId: string) {
  const stops = await prisma.roundStop.findMany({ where: { roundId } });
  if (stops.length === 0) return;
  const allDone = stops.every((s) => s.status === "DELIVERED" || s.status === "FAILED");
  const anyStarted = stops.some((s) => s.status !== "PENDING");
  await prisma.deliveryRound.update({
    where: { id: roundId },
    data: { status: allDone ? "COMPLETED" : anyStarted ? "IN_PROGRESS" : undefined },
  });
}

// --- dispatch side (a role inside the company) ------------------------

roundsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createRoundSchema.parse(req.body);
    await membershipOrThrow(body.organizationId, req.user!.id, DISPATCH_ROLES);

    const round = await prisma.deliveryRound.create({
      data: {
        reference: await nextRoundReference(),
        organizationId: body.organizationId,
        dispatcherId: req.user!.id,
        date: body.date,
        stops: { create: body.stops.map((s, i) => ({ ...s, position: i + 1 })) },
      },
      include: { stops: { orderBy: { position: "asc" } } },
    });
    res.status(201).json({ round });
  }),
);

// Hands the round to a carrier company and/or a named driver. The
// dispatcher assigns work; they never hold the driver's password.
roundsRouter.post(
  "/:id/assign",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = z
      .object({ carrierOrgId: z.string().optional(), driverId: z.string().optional() })
      .refine((b) => b.carrierOrgId || b.driverId, { message: "carrierOrgId ou driverId requis" })
      .parse(req.body);

    const round = await prisma.deliveryRound.findUnique({ where: { id: req.params.id } });
    if (!round) throw new ApiError(404, "ROUND_NOT_FOUND");
    if (!round.organizationId) throw new ApiError(409, "ROUND_WITHOUT_ORGANIZATION");
    await membershipOrThrow(round.organizationId, req.user!.id, DISPATCH_ROLES);

    if (body.carrierOrgId) {
      const carrier = await prisma.organization.findUnique({ where: { id: body.carrierOrgId } });
      if (!carrier) throw new ApiError(404, "CARRIER_NOT_FOUND");
    }

    if (body.driverId) {
      const driverOrgId = body.carrierOrgId ?? round.carrierOrgId ?? round.organizationId;
      const isDriverMember = await prisma.organizationMember.findUnique({
        where: { organizationId_userId: { organizationId: driverOrgId, userId: body.driverId } },
      });
      if (!isDriverMember || isDriverMember.role !== "CHAUFFEUR") {
        throw new ApiError(
          400,
          "NOT_A_DRIVER",
          "Ce compte n'est pas rattaché comme chauffeur à l'entreprise concernée.",
        );
      }
    }

    const updated = await prisma.deliveryRound.update({
      where: { id: round.id },
      data: {
        carrierOrgId: body.carrierOrgId ?? round.carrierOrgId,
        driverId: body.driverId ?? round.driverId,
        status: "ASSIGNED",
      },
    });
    res.json({ round: updated });
  }),
);

// Drivers a dispatcher can assign work to: members of the company (or of
// the carrier company) holding the CHAUFFEUR role. Only id/name/email.
roundsRouter.get(
  "/drivers",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { organizationId } = z.object({ organizationId: z.string().min(1) }).parse(req.query);
    await membershipOrThrow(organizationId, req.user!.id, DISPATCH_ROLES);

    const members = await prisma.organizationMember.findMany({
      where: { organizationId, role: "CHAUFFEUR" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.json({ drivers: members.map((m) => m.user) });
  }),
);

// Counters computed from real rows only — nothing invented.
roundsRouter.get(
  "/dispatch-summary",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { organizationId } = z.object({ organizationId: z.string().min(1) }).parse(req.query);
    await membershipOrThrow(organizationId, req.user!.id, [...ORGANIZATION_MEMBER_ROLES]);

    const [rounds, parcels] = await Promise.all([
      prisma.deliveryRound.findMany({ where: { organizationId }, include: { stops: true } }),
      prisma.parcel.findMany({ where: { organizationId } }),
    ]);

    const today = new Date().toDateString();
    res.json({
      summary: {
        parcelsToDispatch: parcels.filter((p) => p.status === "READY_TO_DISPATCH" || p.status === "CREATED").length,
        parcelsAssigned: parcels.filter((p) => p.status === "ASSIGNED" || p.status === "PICKED_UP" || p.status === "IN_DELIVERY").length,
        parcelsDelivered: parcels.filter((p) => p.status === "DELIVERED").length,
        parcelsReturned: parcels.filter((p) => p.status === "RETURNED").length,
        parcelsInIncident: parcels.filter((p) => p.status === "INCIDENT").length,
        activeRounds: rounds.filter((r) => r.status === "IN_PROGRESS" || r.status === "ASSIGNED").length,
        driversOnDuty: new Set(rounds.filter((r) => r.status === "IN_PROGRESS").map((r) => r.driverId).filter(Boolean)).size,
        stopsDeliveredToday: rounds
          .flatMap((r) => r.stops)
          .filter((s) => s.status === "DELIVERED" && s.completedAt && s.completedAt.toDateString() === today).length,
      },
    });
  }),
);

// --- shared -----------------------------------------------------------

roundsRouter.get(
  "/mine",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rounds = await prisma.deliveryRound.findMany({
      where: { OR: [{ driverId: req.user!.id }, { dispatcherId: req.user!.id }] },
      include: {
        stops: { orderBy: { position: "asc" } },
        parcels: { select: { id: true, code: true, status: true, recipientName: true, recipientAddress: true } },
        driver: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
    });
    res.json({ rounds });
  }),
);

roundsRouter.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const round = await prisma.deliveryRound.findUnique({
      where: { id: req.params.id },
      include: {
        stops: { orderBy: { position: "asc" }, include: { events: { orderBy: { createdAt: "asc" } } } },
        parcels: { select: { id: true, code: true, status: true, recipientName: true, recipientAddress: true } },
        driver: { select: { id: true, name: true } },
      },
    });
    if (!round) throw new ApiError(404, "ROUND_NOT_FOUND");

    const allowed =
      round.driverId === req.user!.id ||
      round.dispatcherId === req.user!.id ||
      req.user!.role === "ADMIN" ||
      (round.organizationId ? await isMemberOf(round.organizationId, req.user!.id, [...ORGANIZATION_MEMBER_ROLES]) : false) ||
      (round.carrierOrgId ? await isMemberOf(round.carrierOrgId, req.user!.id, [...ORGANIZATION_MEMBER_ROLES]) : false);
    if (!allowed) throw new ApiError(403, "FORBIDDEN");

    res.json({ round });
  }),
);

// --- driver side ------------------------------------------------------

async function loadStop(roundId: string, stopId: string) {
  const stop = await prisma.roundStop.findUnique({ where: { id: stopId } });
  if (!stop || stop.roundId !== roundId) throw new ApiError(404, "STOP_NOT_FOUND");
  return stop;
}

roundsRouter.post(
  "/:id/stops/:stopId/scan",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { parcelCode } = z.object({ parcelCode: z.string().min(1) }).parse(req.body);
    await loadRoundForDriver(req.params.id, req.user!.id);
    const stop = await loadStop(req.params.id, req.params.stopId);

    if (stop.parcelCode && stop.parcelCode !== parcelCode) {
      throw new ApiError(409, "PARCEL_CODE_MISMATCH", "Ce colis ne correspond pas à cet arrêt.");
    }

    const updated = await prisma.roundStop.update({
      where: { id: stop.id },
      data: { status: "IN_PROGRESS", parcelCode },
    });
    await prisma.roundStopEvent.create({ data: { stopId: stop.id, type: "SCANNED", data: JSON.stringify({ parcelCode }) } });
    await refreshRoundStatus(req.params.id);

    res.json({ stop: updated });
  }),
);

roundsRouter.post(
  "/:id/stops/:stopId/deliver",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = z
      .object({ podSignature: z.string().max(200000).optional(), podNote: z.string().max(500).optional() })
      .parse(req.body ?? {});
    await loadRoundForDriver(req.params.id, req.user!.id);
    const stop = await loadStop(req.params.id, req.params.stopId);
    if (stop.status === "DELIVERED") throw new ApiError(409, "ALREADY_DELIVERED");

    const updated = await prisma.roundStop.update({
      where: { id: stop.id },
      data: {
        status: "DELIVERED",
        completedAt: new Date(),
        podSignature: body.podSignature,
        podNote: body.podNote,
      },
    });
    await prisma.roundStopEvent.create({
      data: { stopId: stop.id, type: "DELIVERED", data: JSON.stringify({ pod: Boolean(body.podSignature) }) },
    });
    await refreshRoundStatus(req.params.id);

    res.json({ stop: updated });
  }),
);

roundsRouter.post(
  "/:id/stops/:stopId/fail",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { reason } = z.object({ reason: z.string().min(1).max(300) }).parse(req.body);
    await loadRoundForDriver(req.params.id, req.user!.id);
    const stop = await loadStop(req.params.id, req.params.stopId);

    const updated = await prisma.roundStop.update({
      where: { id: stop.id },
      data: { status: "FAILED", failureReason: reason, completedAt: new Date() },
    });
    await prisma.roundStopEvent.create({ data: { stopId: stop.id, type: "FAILED", data: JSON.stringify({ reason }) } });
    await refreshRoundStatus(req.params.id);

    res.json({ stop: updated });
  }),
);
