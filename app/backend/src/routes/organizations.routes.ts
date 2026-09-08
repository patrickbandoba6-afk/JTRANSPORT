import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { ORGANIZATION_ACTIVITIES } from "../domain.js";

export const organizationsRouter = Router();

const createOrgSchema = z.object({
  name: z.string().min(1),
  activity: z.enum(ORGANIZATION_ACTIVITIES),
  country: z.string().min(1),
  hasProfessionalCapacity: z.boolean(),
});

const createCapacitySchema = z.object({
  vehicleType: z.string().min(1),
  weightCapacityKg: z.coerce.number().positive(),
  volumeCapacityM3: z.coerce.number().positive().optional(),
  zone: z.string().min(1),
  availableFrom: z.coerce.date(),
  availableTo: z.coerce.date().optional(),
  pricePerUnit: z.coerce.number().positive().optional(),
});

// "Créer mon entreprise de transport" — creating an organization never
// grants professional capacity by itself; hasProfessionalCapacity is a
// user-declared flag, and verificationStatus stays UNVERIFIED until an
// administrator review sets it (no such endpoint exists yet — admin
// verification is a later phase).
organizationsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createOrgSchema.parse(req.body);
    const organization = await prisma.organization.create({
      data: { ...body, ownerId: req.user!.id },
    });
    res.status(201).json({ organization });
  }),
);

organizationsRouter.get(
  "/mine",
  requireAuth,
  asyncHandler(async (req, res) => {
    const organizations = await prisma.organization.findMany({
      where: { ownerId: req.user!.id },
      include: { capacities: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ organizations });
  }),
);

organizationsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const organization = await prisma.organization.findUnique({
      where: { id: req.params.id },
      include: { capacities: { where: { status: "PUBLISHED" } } },
    });
    if (!organization) throw new ApiError(404, "ORGANIZATION_NOT_FOUND");
    res.json({ organization });
  }),
);

organizationsRouter.post(
  "/:id/capacities",
  requireAuth,
  asyncHandler(async (req, res) => {
    const organization = await prisma.organization.findUnique({ where: { id: req.params.id } });
    if (!organization) throw new ApiError(404, "ORGANIZATION_NOT_FOUND");
    if (organization.ownerId !== req.user!.id) {
      throw new ApiError(403, "FORBIDDEN", "Seul le propriétaire de l'entreprise peut publier une capacité.");
    }

    const body = createCapacitySchema.parse(req.body);
    const capacity = await prisma.transportCapacity.create({
      data: { ...body, organizationId: organization.id },
    });
    res.status(201).json({ capacity });
  }),
);
