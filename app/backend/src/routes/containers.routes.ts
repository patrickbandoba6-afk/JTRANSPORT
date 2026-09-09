import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireRole } from "../middleware/auth.js";
import { CONTAINER_TYPES, CONTAINER_STATUSES } from "../domain.js";

export const containersRouter = Router();

const createContainerSchema = z.object({
  containerNumber: z.string().min(1),
  type: z.enum(CONTAINER_TYPES),
  originPort: z.string().min(1),
  destinationPort: z.string().min(1),
  shippingLine: z.string().optional(),
  vesselName: z.string().optional(),
  etd: z.coerce.date().optional(),
  eta: z.coerce.date().optional(),
});

const updateContainerSchema = z.object({
  status: z.enum(CONTAINER_STATUSES).optional(),
  sealNumber: z.string().optional(),
  vesselName: z.string().optional(),
  etd: z.coerce.date().optional(),
  eta: z.coerce.date().optional(),
});

// Container operations are ADMIN-only for now — the seam where a real
// carrier/booking integration (or a dispatcher/warehouse role) plugs in.
containersRouter.post(
  "/",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const body = createContainerSchema.parse(req.body);
    const container = await prisma.container.create({ data: body });
    res.status(201).json({ container });
  }),
);

containersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const container = await prisma.container.findUnique({
      where: { id: req.params.id },
      include: { shipments: { select: { id: true, status: true, originCity: true, destinationCity: true } } },
    });
    if (!container) throw new ApiError(404, "CONTAINER_NOT_FOUND");
    res.json({ container });
  }),
);

containersRouter.patch(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const body = updateContainerSchema.parse(req.body);
    const container = await prisma.container.findUnique({ where: { id: req.params.id } });
    if (!container) throw new ApiError(404, "CONTAINER_NOT_FOUND");

    const updated = await prisma.container.update({ where: { id: container.id }, data: body });

    if (body.status) {
      const shipments = await prisma.shipment.findMany({ where: { containerId: container.id } });
      await prisma.$transaction(
        shipments.flatMap((s) => [
          prisma.trackingEvent.create({ data: { shipmentId: s.id, type: body.status! } }),
          prisma.shipment.update({ where: { id: s.id }, data: { status: body.status! } }),
        ]),
      );
    }

    res.json({ container: updated });
  }),
);
