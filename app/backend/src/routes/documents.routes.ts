import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  DOCUMENT_TYPES,
  DOSSIER_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
  type DossierType,
} from "../domain.js";
import { DOCUMENTS_STORAGE_DIR, ensureStorageDir } from "../storage.js";
import { signDownloadToken, verifyDownloadToken } from "../utils/signedUrl.js";

export const documentsRouter = Router();

ensureStorageDir();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_DOCUMENT_SIZE_BYTES },
});

const uploadMetaSchema = z.object({
  dossierType: z.enum(DOSSIER_TYPES),
  dossierId: z.string().min(1),
  type: z.enum(DOCUMENT_TYPES),
});

const listQuerySchema = z.object({
  dossierType: z.enum(DOSSIER_TYPES),
  dossierId: z.string().min(1),
});

// Checks the caller is actually a party to the dossier before granting any
// document access. Never trust the client for this — it's re-checked on
// every upload, list, and download.
async function assertDossierAccess(dossierType: DossierType, dossierId: string, userId: string) {
  if (dossierType === "MISSION") {
    const mission = await prisma.mission.findUnique({ where: { id: dossierId } });
    if (!mission) throw new ApiError(404, "DOSSIER_NOT_FOUND");
    if (mission.ownerId === userId) return;
    const wonOffer = await prisma.missionOffer.findFirst({
      where: { missionId: dossierId, providerId: userId, status: "ACCEPTED" },
    });
    if (wonOffer) return;
    throw new ApiError(403, "FORBIDDEN");
  }

  if (dossierType === "CONTRACT") {
    const contract = await prisma.contract.findUnique({ where: { id: dossierId } });
    if (!contract) throw new ApiError(404, "DOSSIER_NOT_FOUND");
    if (contract.ownerId === userId || contract.counterpartyId === userId) return;
    throw new ApiError(403, "FORBIDDEN");
  }

  if (dossierType === "ORGANIZATION") {
    const organization = await prisma.organization.findUnique({ where: { id: dossierId } });
    if (!organization) throw new ApiError(404, "DOSSIER_NOT_FOUND");
    if (organization.ownerId === userId) return;
    throw new ApiError(403, "FORBIDDEN");
  }

  if (dossierType === "SHIPMENT") {
    const shipment = await prisma.shipment.findUnique({ where: { id: dossierId } });
    if (!shipment) throw new ApiError(404, "DOSSIER_NOT_FOUND");
    if (shipment.ownerId === userId) return;
    throw new ApiError(403, "FORBIDDEN");
  }
}

async function logEvent(documentId: string, type: string, userId?: string) {
  await prisma.documentEvent.create({ data: { documentId, type, userId } });
}

documentsRouter.post(
  "/",
  requireAuth,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "FILE_REQUIRED");
    if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(req.file.mimetype as (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number])) {
      throw new ApiError(415, "UNSUPPORTED_FILE_TYPE", "Formats acceptés : PDF, JPEG, PNG, WEBP.");
    }

    const meta = uploadMetaSchema.parse(req.body);
    await assertDossierAccess(meta.dossierType, meta.dossierId, req.user!.id);

    const storageKey = `${crypto.randomUUID()}${path.extname(req.file.originalname)}`;
    fs.writeFileSync(path.join(DOCUMENTS_STORAGE_DIR, storageKey), req.file.buffer);

    const document = await prisma.document.create({
      data: {
        ownerId: req.user!.id,
        contractId: meta.dossierType === "CONTRACT" ? meta.dossierId : null,
        dossierType: meta.dossierType,
        dossierId: meta.dossierId,
        type: meta.type,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        storageKey,
      },
    });
    await logEvent(document.id, "UPLOADED", req.user!.id);

    res.status(201).json({ document: { ...document, storageKey: undefined } });
  }),
);

documentsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const query = listQuerySchema.parse(req.query);
    await assertDossierAccess(query.dossierType, query.dossierId, req.user!.id);

    const documents = await prisma.document.findMany({
      where: { dossierType: query.dossierType, dossierId: query.dossierId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });
    res.json({ documents: documents.map((d) => ({ ...d, storageKey: undefined })) });
  }),
);

// Returns a short-lived signed download URL rather than the file directly —
// see src/utils/signedUrl.ts.
documentsRouter.get(
  "/:id/signed-url",
  requireAuth,
  asyncHandler(async (req, res) => {
    const document = await prisma.document.findUnique({ where: { id: req.params.id } });
    if (!document) throw new ApiError(404, "DOCUMENT_NOT_FOUND");
    await assertDossierAccess(document.dossierType as DossierType, document.dossierId, req.user!.id);

    const token = signDownloadToken(document.id);
    await logEvent(document.id, "SIGNED_URL_ISSUED", req.user!.id);

    res.json({ url: `/api/documents/${document.id}/download?token=${token}`, expiresInSeconds: 300 });
  }),
);

documentsRouter.get(
  "/:id/download",
  asyncHandler(async (req, res) => {
    const document = await prisma.document.findUnique({ where: { id: req.params.id } });
    if (!document) throw new ApiError(404, "DOCUMENT_NOT_FOUND");

    const token = typeof req.query.token === "string" ? req.query.token : "";
    if (!verifyDownloadToken(token, document.id)) {
      throw new ApiError(403, "INVALID_OR_EXPIRED_TOKEN");
    }

    await logEvent(document.id, "DOWNLOADED", req.user?.id);

    res.setHeader("Content-Type", document.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${document.filename}"`);
    res.sendFile(path.join(DOCUMENTS_STORAGE_DIR, document.storageKey));
  }),
);
