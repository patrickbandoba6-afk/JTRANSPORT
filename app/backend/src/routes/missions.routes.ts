import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const missionsRouter = Router();

const createMissionSchema = z.object({
  fromCity: z.string().min(1),
  toCity: z.string().min(1),
  date: z.coerce.date(),
  cargo: z.string().min(1),
  weightKg: z.coerce.number().positive(),
  vehicleType: z.string().min(1),
  budget: z.coerce.number().positive(),
  recurring: z.boolean().optional().default(false),
});

const createOfferSchema = z.object({
  price: z.coerce.number().positive(),
  message: z.string().optional(),
});

const searchQuerySchema = z.object({
  fromCity: z.string().optional(),
  toCity: z.string().optional(),
  vehicleType: z.string().optional(),
  status: z.string().optional(),
  mine: z.coerce.boolean().optional(),
});

async function logEvent(missionId: string, type: string, data?: unknown) {
  await prisma.missionEvent.create({
    data: {
      missionId,
      type,
      data: data === undefined ? null : JSON.stringify(data),
    },
  });
}

// Public search/listing — filters are exact-match on city/vehicle for now.
missionsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = searchQuerySchema.parse(req.query);

    if (query.mine && !req.user) {
      throw new ApiError(401, "AUTHENTICATION_REQUIRED");
    }

    const missions = await prisma.mission.findMany({
      where: {
        ...(query.mine ? { ownerId: req.user!.id } : { status: query.status ?? "PUBLISHED" }),
        ...(query.fromCity ? { fromCity: { contains: query.fromCity } } : {}),
        ...(query.toCity ? { toCity: { contains: query.toCity } } : {}),
        ...(query.vehicleType ? { vehicleType: query.vehicleType } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { offers: true } } },
    });

    res.json({ missions });
  }),
);

// Offers the current user has submitted, across every mission — the
// TRANSPORTEUR-facing "mes offres" view. Registered before "/:id" so
// "offers" is never swallowed as a mission id.
missionsRouter.get(
  "/offers/mine",
  requireAuth,
  asyncHandler(async (req, res) => {
    const offers = await prisma.missionOffer.findMany({
      where: { providerId: req.user!.id },
      include: { mission: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ offers });
  }),
);

missionsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const mission = await prisma.mission.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { offers: true } } },
    });
    if (!mission) {
      throw new ApiError(404, "MISSION_NOT_FOUND");
    }
    res.json({ mission });
  }),
);

missionsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createMissionSchema.parse(req.body);

    const mission = await prisma.mission.create({
      data: { ...body, ownerId: req.user!.id },
    });
    await logEvent(mission.id, "STATUS_CHANGE", { status: mission.status });

    res.status(201).json({ mission });
  }),
);

// Offers received by the mission owner — private.
missionsRouter.get(
  "/:id/offers",
  requireAuth,
  asyncHandler(async (req, res) => {
    const mission = await prisma.mission.findUnique({ where: { id: req.params.id } });
    if (!mission) {
      throw new ApiError(404, "MISSION_NOT_FOUND");
    }
    if (mission.ownerId !== req.user!.id) {
      throw new ApiError(403, "FORBIDDEN", "Seul le donneur d'ordre peut voir les offres.");
    }

    const offers = await prisma.missionOffer.findMany({
      where: { missionId: mission.id },
      include: { provider: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.json({ offers });
  }),
);

missionsRouter.post(
  "/:id/offers",
  requireRole("TRANSPORTEUR"),
  asyncHandler(async (req, res) => {
    const body = createOfferSchema.parse(req.body);

    const mission = await prisma.mission.findUnique({ where: { id: req.params.id } });
    if (!mission) {
      throw new ApiError(404, "MISSION_NOT_FOUND");
    }
    if (mission.status !== "PUBLISHED") {
      throw new ApiError(409, "MISSION_NOT_OPEN", "Cette mission n'accepte plus d'offres.");
    }
    if (mission.ownerId === req.user!.id) {
      throw new ApiError(400, "CANNOT_OFFER_ON_OWN_MISSION");
    }

    const existing = await prisma.missionOffer.findUnique({
      where: { missionId_providerId: { missionId: mission.id, providerId: req.user!.id } },
    });
    if (existing) {
      throw new ApiError(409, "OFFER_ALREADY_SUBMITTED");
    }

    const offer = await prisma.missionOffer.create({
      data: {
        missionId: mission.id,
        providerId: req.user!.id,
        price: body.price,
        message: body.message,
      },
    });
    await logEvent(mission.id, "OFFER_RECEIVED", { offerId: offer.id, price: offer.price });

    res.status(201).json({ offer });
  }),
);

// Accepting an offer attributes the mission and rejects the other pending
// offers in the same transaction, matching the "une seule offre gagnante"
// rule from backend/README.md.
missionsRouter.post(
  "/:id/offers/:offerId/accept",
  requireAuth,
  asyncHandler(async (req, res) => {
    const mission = await prisma.mission.findUnique({ where: { id: req.params.id } });
    if (!mission) {
      throw new ApiError(404, "MISSION_NOT_FOUND");
    }
    if (mission.ownerId !== req.user!.id) {
      throw new ApiError(403, "FORBIDDEN", "Seul le donneur d'ordre peut attribuer la mission.");
    }
    if (mission.status !== "PUBLISHED") {
      throw new ApiError(409, "MISSION_NOT_OPEN");
    }

    const offer = await prisma.missionOffer.findUnique({ where: { id: req.params.offerId } });
    if (!offer || offer.missionId !== mission.id) {
      throw new ApiError(404, "OFFER_NOT_FOUND");
    }
    if (offer.status !== "PENDING") {
      throw new ApiError(409, "OFFER_NOT_PENDING");
    }

    await prisma.$transaction([
      prisma.missionOffer.update({ where: { id: offer.id }, data: { status: "ACCEPTED" } }),
      prisma.missionOffer.updateMany({
        where: { missionId: mission.id, id: { not: offer.id }, status: "PENDING" },
        data: { status: "REJECTED" },
      }),
      prisma.mission.update({ where: { id: mission.id }, data: { status: "ATTRIBUTED" } }),
    ]);
    await logEvent(mission.id, "OFFER_ACCEPTED", { offerId: offer.id });
    await logEvent(mission.id, "STATUS_CHANGE", { status: "ATTRIBUTED" });

    const updated = await prisma.mission.findUnique({ where: { id: mission.id } });
    res.json({ mission: updated });
  }),
);
