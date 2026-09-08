import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAuthToken } from "../utils/jwt.js";
import { ROLES } from "../domain.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { requireAuth, COOKIE_NAME } from "../middleware/auth.js";
import { env } from "../env.js";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  name: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(ROLES),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function setAuthCookie(res: import("express").Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function publicUser(user: { id: string; email: string; name: string; phone: string | null; role: string }) {
  return { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role };
}

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      throw new ApiError(409, "EMAIL_ALREADY_USED", "Un compte existe déjà avec cet e-mail.");
    }

    const passwordHash = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        name: body.name,
        phone: body.phone,
        role: body.role,
      },
    });

    const token = signAuthToken({ sub: user.id, role: body.role });
    setAuthCookie(res, token);
    res.status(201).json({ user: publicUser(user), token });
  }),
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "E-mail ou mot de passe incorrect.");
    }

    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "E-mail ou mot de passe incorrect.");
    }

    const token = signAuthToken({ sub: user.id, role: user.role as (typeof ROLES)[number] });
    setAuthCookie(res, token);
    res.json({ user: publicUser(user), token });
  }),
);

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.status(204).send();
});

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      throw new ApiError(404, "USER_NOT_FOUND");
    }
    res.json({ user: publicUser(user) });
  }),
);
