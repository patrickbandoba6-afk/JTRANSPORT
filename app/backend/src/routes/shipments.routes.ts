import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  SHIPMENT_STATUSES,
  CUSTOMS_STATUSES,
  TRANSPORT_MODES,
  CARGO_TYPES,
  CUSTOMS_FEES_STATUSES,
} from "../domain.js";
import { newParcelCode } from "../utils/parcelCode.js";

export const shipmentsRouter = Router();

const parcelSchema = z.object({
  description: z.string().min(1),
  weightKg: z.coerce.number().positive(),
  lengthCm: z.coerce.number().positive().optional(),
  widthCm: z.coerce.number().positive().optional(),
  heightCm: z.coerce.number().positive().optional(),
  declaredValue: z.coerce.number().positive().optional(),
});

const vehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  vin: z.string().optional(),
  plate: z.string().optional(),
  condition: z.string().optional(),
  valueDeclared: z.coerce.number().positive().optional(),
});

const createShipmentSchema = z
  .object({
    originCity: z.string().min(1),
    originCountry: z.string().min(1),
    destinationCity: z.string().min(1),
    destinationCountry: z.string().min(1),
    recipientName: z.string().min(1),
    recipientPhone: z.string().optional(),
    recipientEmail: z.string().email().optional(),
    recipientAddress: z.string().min(1),
    mode: z.enum(TRANSPORT_MODES).default("ROUTIER"),
    cargoType: z.enum(CARGO_TYPES).default("COLIS"),
    parcels: z.array(parcelSchema).default([]),
    vehicles: z.array(vehicleSchema).default([]),
  })
  .refine((b) => b.parcels.length > 0 || b.vehicles.length > 0, {
    message: "Indiquez au moins un colis ou un véhicule à transporter.",
  });

const addEventSchema = z.object({
  type: z.enum(SHIPMENT_STATUSES),
  location: z.string().optional(),
  note: z.string().optional(),
});

const updateCustomsSchema = z.object({
  status: z.enum(CUSTOMS_STATUSES).optional(),
  declaredValue: z.coerce.number().positive().optional(),
  hsCode: z.string().optional(),
  incoterm: z.string().optional(),
  estimatedFees: z.coerce.number().positive().optional(),
  // Only ever set from an amount actually notified by the authority or the
  // customs broker — never computed by JTransport.
  officialFees: z.coerce.number().positive().optional(),
  feesStatus: z.enum(CUSTOMS_FEES_STATUSES).optional(),
});

async function requireOwnerOrAdmin(shipmentId: string, userId: string, role: string) {
  const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
  if (!shipment) throw new ApiError(404, "SHIPMENT_NOT_FOUND");
  if (shipment.ownerId !== userId && role !== "ADMIN") throw new ApiError(403, "FORBIDDEN");
  return shipment;
}

// Creates the shipment and, when origin/destination countries differ,
// automatically opens the digital customs dossier (cahier des charges §13).
shipmentsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createShipmentSchema.parse(req.body);

    const shipment = await prisma.shipment.create({
      data: {
        ownerId: req.user!.id,
        originCity: body.originCity,
        originCountry: body.originCountry,
        destinationCity: body.destinationCity,
        destinationCountry: body.destinationCountry,
        recipientName: body.recipientName,
        recipientPhone: body.recipientPhone,
        recipientEmail: body.recipientEmail,
        recipientAddress: body.recipientAddress,
        mode: body.mode,
        cargoType: body.cargoType,
        parcels: { create: body.parcels.map((p) => ({ ...p, code: newParcelCode() })) },
        vehicles: { create: body.vehicles },
        events: { create: { type: "CREATED" } },
        ...(body.originCountry.toUpperCase() !== body.destinationCountry.toUpperCase()
          ? { customsCase: { create: {} } }
          : {}),
      },
      include: { parcels: true, customsCase: true, vehicles: true },
    });

    res.status(201).json({ shipment });
  }),
);

shipmentsRouter.get(
  "/mine",
  requireAuth,
  asyncHandler(async (req, res) => {
    const shipments = await prisma.shipment.findMany({
      where: { ownerId: req.user!.id },
      include: { parcels: true, container: true, _count: { select: { events: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ shipments });
  }),
);

shipmentsRouter.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await requireOwnerOrAdmin(req.params.id, req.user!.id, req.user!.role);
    const shipment = await prisma.shipment.findUnique({
      where: { id: req.params.id },
      include: {
        parcels: true,
        container: true,
        customsCase: true,
        vehicles: true,
        events: { orderBy: { createdAt: "asc" } },
      },
    });
    res.json({ shipment });
  }),
);

// The paperwork checklist for this shipment: which documents its mode /
// cargo / country pair calls for, and which ones are already in the vault.
// Indicative only — customs rules are configurable data, not legal advice.
shipmentsRouter.get(
  "/:id/requirements",
  requireAuth,
  asyncHandler(async (req, res) => {
    const shipment = await requireOwnerOrAdmin(req.params.id, req.user!.id, req.user!.role);

    const requirements = await prisma.customsRequirement.findMany({
      where: {
        AND: [
          { OR: [{ mode: null }, { mode: shipment.mode }] },
          { OR: [{ cargoType: null }, { cargoType: shipment.cargoType }] },
          { OR: [{ countryFrom: null }, { countryFrom: shipment.originCountry.toUpperCase() }] },
          { OR: [{ countryTo: null }, { countryTo: shipment.destinationCountry.toUpperCase() }] },
        ],
      },
      orderBy: [{ mandatory: "desc" }, { label: "asc" }],
    });

    const documents = await prisma.document.findMany({
      where: { dossierType: "SHIPMENT", dossierId: shipment.id, status: "ACTIVE" },
      select: { id: true, type: true, filename: true },
    });
    const providedTypes = new Set(documents.map((d) => d.type));

    const checklist = requirements.map((r) => ({
      ...r,
      provided: providedTypes.has(r.documentType),
    }));

    res.json({
      checklist,
      missingMandatory: checklist.filter((c) => c.mandatory && !c.provided).length,
      documents,
      international: shipment.originCountry.toUpperCase() !== shipment.destinationCountry.toUpperCase(),
    });
  }),
);

// Adding a tracking event is an operator action (ADMIN today — the seam
// where a real TrackingProviderAdapter / dispatcher role plugs in later).
// Never let a client fabricate their own shipment's history.
shipmentsRouter.post(
  "/:id/events",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const body = addEventSchema.parse(req.body);
    const shipment = await prisma.shipment.findUnique({ where: { id: req.params.id } });
    if (!shipment) throw new ApiError(404, "SHIPMENT_NOT_FOUND");

    const [, updated] = await prisma.$transaction([
      prisma.trackingEvent.create({
        data: { shipmentId: shipment.id, type: body.type, location: body.location, note: body.note },
      }),
      prisma.shipment.update({ where: { id: shipment.id }, data: { status: body.type } }),
    ]);

    res.status(201).json({ shipment: updated });
  }),
);

shipmentsRouter.post(
  "/:id/assign-container",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const { containerId } = z.object({ containerId: z.string().min(1) }).parse(req.body);
    const [container, shipment] = await Promise.all([
      prisma.container.findUnique({ where: { id: containerId } }),
      prisma.shipment.findUnique({ where: { id: req.params.id } }),
    ]);
    if (!container) throw new ApiError(404, "CONTAINER_NOT_FOUND");
    if (!shipment) throw new ApiError(404, "SHIPMENT_NOT_FOUND");

    const updated = await prisma.shipment.update({
      where: { id: shipment.id },
      data: { containerId: container.id, status: "IN_CONTAINER" },
    });
    await prisma.trackingEvent.create({ data: { shipmentId: shipment.id, type: "IN_CONTAINER" } });

    res.json({ shipment: updated });
  }),
);

// Estimates only — never presented as an official duty amount (cahier §31).
shipmentsRouter.patch(
  "/:id/customs-case",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const body = updateCustomsSchema.parse(req.body);
    const shipment = await prisma.shipment.findUnique({ where: { id: req.params.id }, include: { customsCase: true } });
    if (!shipment) throw new ApiError(404, "SHIPMENT_NOT_FOUND");
    if (!shipment.customsCase) throw new ApiError(409, "NO_CUSTOMS_CASE", "Cette expédition est nationale, aucun dossier douanier n'existe.");

    const customsCase = await prisma.customsCase.update({
      where: { shipmentId: shipment.id },
      data: body,
    });
    res.json({ customsCase });
  }),
);
