import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const roundsRouter = Router();

const stopInputSchema = z.object({
  label: z.string().min(1),
  address: z.string().min(1),
  parcelCode: z.string().optional(),
  recipient: z.string().optional(),
});

const createRoundSchema = z.object({
  date: z.coerce.date(),
  stops: z.array(stopInputSchema).min(1),
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
  const allDone = stops.every((s) => s.status === "DELIVERED" || s.status === "FAILED");
  const anyStarted = stops.some((s) => s.status !== "PENDING");
  await prisma.deliveryRound.update({
    where: { id: roundId },
    data: { status: allDone ? "COMPLETED" : anyStarted ? "IN_PROGRESS" : undefined },
  });
}

// --- Dispatcher side -------------------------------------------------

roundsRouter.post(
  "/",
  requireRole("DISPATCHER", "ADMIN"),
  asyncHandler(async (req, res) => {
    const body = createRoundSchema.parse(req.body);
    const round = await prisma.deliveryRound.create({
      data: {
        reference: await nextRoundReference(),
        dispatcherId: req.user!.id,
        date: body.date,
        stops: { create: body.stops.map((s, i) => ({ ...s, position: i + 1 })) },
      },
      include: { stops: { orderBy: { position: "asc" } } },
    });
    res.status(201).json({ round });
  }),
);

roundsRouter.post(
  "/:id/assign",
  requireRole("DISPATCHER", "ADMIN"),
  asyncHandler(async (req, res) => {
    const { driverId } = z.object({ driverId: z.string().min(1) }).parse(req.body);
    const round = await prisma.deliveryRound.findUnique({ where: { id: req.params.id } });
    if (!round) throw new ApiError(404, "ROUND_NOT_FOUND");
    if (round.dispatcherId !== req.user!.id && req.user!.role !== "ADMIN") throw new ApiError(403, "FORBIDDEN");

    const driver = await prisma.user.findUnique({ where: { id: driverId } });
    if (!driver) throw new ApiError(404, "DRIVER_NOT_FOUND");
    if (driver.role !== "CHAUFFEUR") {
      throw new ApiError(400, "NOT_A_DRIVER", "Ce compte n'est pas un compte chauffeur/livreur.");
    }

    // The dispatcher assigns work to a driver account; they never hold that
    // account's password (cahier des charges §17).
    const updated = await prisma.deliveryRound.update({
      where: { id: round.id },
      data: { driverId: driver.id, status: "ASSIGNED" },
    });
    res.json({ round: updated });
  }),
);

// Live counters for the dispatcher centrale — computed from real rows only.
roundsRouter.get(
  "/dispatch-summary",
  requireRole("DISPATCHER", "ADMIN"),
  asyncHandler(async (req, res) => {
    const rounds = await prisma.deliveryRound.findMany({
      where: { dispatcherId: req.user!.id },
      include: { stops: true },
    });
    const stops = rounds.flatMap((r) => r.stops);
    res.json({
      summary: {
        stopsToProcess: stops.filter((s) => s.status === "PENDING").length,
        activeRounds: rounds.filter((r) => r.status === "IN_PROGRESS" || r.status === "ASSIGNED").length,
        driversOnDuty: new Set(rounds.filter((r) => r.status === "IN_PROGRESS").map((r) => r.driverId)).size,
        deliveredToday: stops.filter(
          (s) => s.status === "DELIVERED" && s.completedAt && s.completedAt.toDateString() === new Date().toDateString(),
        ).length,
      },
    });
  }),
);

// --- Shared ----------------------------------------------------------

roundsRouter.get(
  "/mine",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rounds = await prisma.deliveryRound.findMany({
      where:
        req.user!.role === "CHAUFFEUR"
          ? { driverId: req.user!.id }
          : { dispatcherId: req.user!.id },
      include: {
        stops: { orderBy: { position: "asc" } },
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
        driver: { select: { id: true, name: true } },
      },
    });
    if (!round) throw new ApiError(404, "ROUND_NOT_FOUND");
    const allowed =
      round.driverId === req.user!.id || round.dispatcherId === req.user!.id || req.user!.role === "ADMIN";
    if (!allowed) throw new ApiError(403, "FORBIDDEN");
    res.json({ round });
  }),
);

// --- Driver side -----------------------------------------------------

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
