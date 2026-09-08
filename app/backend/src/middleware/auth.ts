import type { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../utils/jwt.js";
import type { Role } from "../domain.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

const COOKIE_NAME = "jt_token";

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length);
  }
  const cookieToken = (req as unknown as { cookies?: Record<string, string> }).cookies?.[
    COOKIE_NAME
  ];
  return cookieToken ?? null;
}

// Attaches req.user when a valid token is present; never rejects the
// request on its own (some routes are public but behave differently when
// authenticated, e.g. search).
export function attachUser(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      const payload = verifyAuthToken(token);
      req.user = { id: payload.sub, role: payload.role };
    } catch {
      // Invalid/expired token: treat the request as anonymous.
    }
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "AUTHENTICATION_REQUIRED" });
    return;
  }
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "AUTHENTICATION_REQUIRED" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "FORBIDDEN" });
      return;
    }
    next();
  };
}

export { COOKIE_NAME };
