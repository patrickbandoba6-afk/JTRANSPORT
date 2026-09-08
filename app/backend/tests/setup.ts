import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const dbPath = path.resolve(process.cwd(), "prisma/test.db");
if (fs.existsSync(dbPath)) fs.rmSync(dbPath);

process.env.DATABASE_URL = `file:${dbPath}`;
process.env.JWT_SECRET = "test-only-secret-not-for-any-real-environment";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.NODE_ENV = "test";

// Ensure the test SQLite file has the current schema applied.
execSync("npx prisma db push --skip-generate --accept-data-loss", {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
});
