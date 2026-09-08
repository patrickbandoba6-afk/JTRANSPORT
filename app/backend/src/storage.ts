import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Private on-disk document store — never served as static files. Swap for
// an S3/GCS adapter later; only this file and documents.routes.ts would
// need to change (see signedUrl.ts for the "presigned URL" equivalent).
export const DOCUMENTS_STORAGE_DIR = path.join(__dirname, "..", "storage", "documents");

export function ensureStorageDir() {
  fs.mkdirSync(DOCUMENTS_STORAGE_DIR, { recursive: true });
}
