import jwt from "jsonwebtoken";
import { env } from "../env.js";

// Short-lived, single-purpose tokens standing in for real signed storage
// URLs (S3 presigned URLs, etc.) until a cloud storage adapter is wired in.
// Same idea, same guarantee: time-limited, scoped to one document, never a
// permanent public link.
type DownloadTokenPayload = { documentId: string; purpose: "doc-download" };

export function signDownloadToken(documentId: string): string {
  const payload: DownloadTokenPayload = { documentId, purpose: "doc-download" };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "5m" });
}

export function verifyDownloadToken(token: string, documentId: string): boolean {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as DownloadTokenPayload;
    return payload.purpose === "doc-download" && payload.documentId === documentId;
  } catch {
    return false;
  }
}
