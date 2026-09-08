import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";

export const capacitiesRouter = Router();

const searchQuerySchema = z.object({
  zone: z.string().optional(),
  vehicleType: z.string().optional(),
});

// Public marketplace of capacities ("proposer sa capacité" / "trouver une
// capacité disponible") — the other direction of the missions marketplace.
capacitiesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = searchQuerySchema.parse(req.query);
    const capacities = await prisma.transportCapacity.findMany({
      where: {
        status: "PUBLISHED",
        ...(query.zone ? { zone: { contains: query.zone } } : {}),
        ...(query.vehicleType ? { vehicleType: query.vehicleType } : {}),
      },
      include: { organization: { select: { id: true, name: true, verificationStatus: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ capacities });
  }),
);

capacitiesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const capacity = await prisma.transportCapacity.findUnique({
      where: { id: req.params.id },
      include: { organization: { select: { id: true, name: true, verificationStatus: true } } },
    });
    if (!capacity) throw new ApiError(404, "CAPACITY_NOT_FOUND");
    res.json({ capacity });
  }),
);
