import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// One SQLite file per test worker: test files used to share prisma/test.db,
// and on Windows a worker could delete/recreate it while another still held
// it open, leaving a connection pointed at a database with no tables.
const dbPath = path.resolve(process.cwd(), `prisma/test-${process.pid}.db`);
for (const suffix of ["", "-journal"]) {
  if (fs.existsSync(dbPath + suffix)) fs.rmSync(dbPath + suffix);
}

process.env.DATABASE_URL = `file:${dbPath}`;
process.env.JWT_SECRET = "test-only-secret-not-for-any-real-environment";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.NODE_ENV = "test";

execSync("npx prisma db push --skip-generate --accept-data-loss", {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
});
