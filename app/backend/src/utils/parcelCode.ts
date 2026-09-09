import crypto from "node:crypto";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — these get misread off a label

// Human-readable tracking code printed on the label and typed back in by a
// driver when a barcode won't scan.
export function newParcelCode(): string {
  const bytes = crypto.randomBytes(9);
  let body = "";
  for (const b of bytes) body += ALPHABET[b % ALPHABET.length];
  return `JT-${body.slice(0, 3)}-${body.slice(3, 6)}-${body.slice(6, 9)}`;
}
