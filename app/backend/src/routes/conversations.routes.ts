import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";

export const conversationsRouter = Router();

const MAX_MESSAGE_LENGTH = 4000;

const createConversationSchema = z.object({
  participantId: z.string().min(1),
  missionId: z.string().optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(MAX_MESSAGE_LENGTH).optional(),
});

const sendMessageSchema = z.object({
  body: z.string().min(1).max(MAX_MESSAGE_LENGTH),
});

async function requireParticipant(conversationId: string, userId: string) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!participant) {
    const exists = await prisma.conversation.findUnique({ where: { id: conversationId } });
    throw new ApiError(exists ? 403 : 404, exists ? "FORBIDDEN" : "CONVERSATION_NOT_FOUND");
  }
  return participant;
}

// Opens (or reuses) a 1:1 conversation. Reusing avoids piling up duplicate
// threads every time someone taps "Contacter" on the same profile.
conversationsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createConversationSchema.parse(req.body);
    if (body.participantId === req.user!.id) {
      throw new ApiError(400, "CANNOT_MESSAGE_SELF");
    }
    const other = await prisma.user.findUnique({ where: { id: body.participantId } });
    if (!other) throw new ApiError(404, "USER_NOT_FOUND");

    const existing = await prisma.conversation.findFirst({
      where: {
        missionId: body.missionId ?? null,
        AND: [
          { participants: { some: { userId: req.user!.id } } },
          { participants: { some: { userId: body.participantId } } },
        ],
      },
    });

    const conversation =
      existing ??
      (await prisma.conversation.create({
        data: {
          subject: body.subject,
          missionId: body.missionId,
          participants: { create: [{ userId: req.user!.id }, { userId: body.participantId }] },
        },
      }));

    if (body.message) {
      await prisma.message.create({
        data: { conversationId: conversation.id, senderId: req.user!.id, body: body.message },
      });
      await prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });
    }

    res.status(existing ? 200 : 201).json({ conversation });
  }),
);

conversationsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const conversations = await prisma.conversation.findMany({
      where: { participants: { some: { userId: req.user!.id } } },
      include: {
        participants: { include: { user: { select: { id: true, name: true, role: true } } } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });
    res.json({ conversations });
  }),
);

conversationsRouter.get(
  "/:id/messages",
  requireAuth,
  asyncHandler(async (req, res) => {
    await requireParticipant(req.params.id, req.user!.id);
    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id },
      include: { sender: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId: req.params.id, userId: req.user!.id } },
      data: { lastReadAt: new Date() },
    });
    res.json({ messages });
  }),
);

conversationsRouter.post(
  "/:id/messages",
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = sendMessageSchema.parse(req.body);
    await requireParticipant(req.params.id, req.user!.id);

    const message = await prisma.message.create({
      data: { conversationId: req.params.id, senderId: req.user!.id, body: body.body },
      include: { sender: { select: { id: true, name: true } } },
    });
    await prisma.conversation.update({ where: { id: req.params.id }, data: { updatedAt: new Date() } });

    res.status(201).json({ message });
  }),
);
