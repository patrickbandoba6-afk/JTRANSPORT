import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./env.js";
import { attachUser } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error.js";
import { authRouter } from "./routes/auth.routes.js";
import { missionsRouter } from "./routes/missions.routes.js";
import { organizationsRouter } from "./routes/organizations.routes.js";
import { capacitiesRouter } from "./routes/capacities.routes.js";
import { contractsRouter } from "./routes/contracts.routes.js";
import { documentsRouter } from "./routes/documents.routes.js";
import { shipmentsRouter } from "./routes/shipments.routes.js";
import { containersRouter } from "./routes/containers.routes.js";
import { invoicesRouter } from "./routes/invoices.routes.js";
import { conversationsRouter } from "./routes/conversations.routes.js";
import { roundsRouter } from "./routes/rounds.routes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(attachUser);

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/missions", missionsRouter);
  app.use("/api/organizations", organizationsRouter);
  app.use("/api/capacities", capacitiesRouter);
  app.use("/api/contracts", contractsRouter);
  app.use("/api/documents", documentsRouter);
  app.use("/api/shipments", shipmentsRouter);
  app.use("/api/containers", containersRouter);
  app.use("/api/invoices", invoicesRouter);
  app.use("/api/conversations", conversationsRouter);
  app.use("/api/rounds", roundsRouter);

  app.use(errorHandler);

  return app;
}
