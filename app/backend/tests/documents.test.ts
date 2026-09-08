import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

const ownerAgent = request.agent(app);
const strangerAgent = request.agent(app);

let missionId: string;
let documentId: string;

beforeAll(async () => {
  await ownerAgent.post("/api/auth/register").send({
    email: "doc-owner@jtransport.test",
    password: "password123",
    name: "Doc Owner",
    role: "PARTICULIER",
  });
  await strangerAgent.post("/api/auth/register").send({
    email: "doc-stranger@jtransport.test",
    password: "password123",
    name: "Doc Stranger",
    role: "PARTICULIER",
  });

  const mission = await ownerAgent.post("/api/missions").send({
    fromCity: "Nantes",
    toCity: "Rennes",
    date: "2026-12-01",
    cargo: "Cartons",
    weightKg: 100,
    vehicleType: "Fourgon",
    budget: 150,
  });
  missionId = mission.body.mission.id;
});

describe("documents vault", () => {
  it("lets the dossier owner upload a document", async () => {
    const res = await ownerAgent
      .post("/api/documents")
      .field("dossierType", "MISSION")
      .field("dossierId", missionId)
      .field("type", "AUTRE")
      .attach("file", Buffer.from("%PDF-1.4 fake"), { filename: "note.pdf", contentType: "application/pdf" });

    expect(res.status).toBe(201);
    expect(res.body.document.storageKey).toBeUndefined();
    documentId = res.body.document.id;
  });

  it("rejects an unsupported file type", async () => {
    const res = await ownerAgent
      .post("/api/documents")
      .field("dossierType", "MISSION")
      .field("dossierId", missionId)
      .field("type", "AUTRE")
      .attach("file", Buffer.from("console.log(1)"), { filename: "script.js", contentType: "application/javascript" });

    expect(res.status).toBe(415);
  });

  it("blocks a stranger from uploading to a mission they're not part of", async () => {
    const res = await strangerAgent
      .post("/api/documents")
      .field("dossierType", "MISSION")
      .field("dossierId", missionId)
      .field("type", "AUTRE")
      .attach("file", Buffer.from("%PDF-1.4 fake"), { filename: "note.pdf", contentType: "application/pdf" });

    expect(res.status).toBe(403);
  });

  it("blocks a stranger from listing documents on that mission", async () => {
    const res = await strangerAgent.get("/api/documents").query({ dossierType: "MISSION", dossierId: missionId });
    expect(res.status).toBe(403);
  });

  it("lets the owner list documents on their mission", async () => {
    const res = await ownerAgent.get("/api/documents").query({ dossierType: "MISSION", dossierId: missionId });
    expect(res.status).toBe(200);
    expect(res.body.documents.length).toBe(1);
  });

  it("blocks a stranger from getting a signed URL", async () => {
    const res = await strangerAgent.get(`/api/documents/${documentId}/signed-url`);
    expect(res.status).toBe(403);
  });

  it("issues a signed URL to the owner and downloads through it", async () => {
    const signed = await ownerAgent.get(`/api/documents/${documentId}/signed-url`);
    expect(signed.status).toBe(200);
    expect(signed.body.url).toContain(`/api/documents/${documentId}/download?token=`);

    const download = await request(app).get(signed.body.url);
    expect(download.status).toBe(200);
    expect(download.headers["content-type"]).toBe("application/pdf");
  });

  it("rejects a download without a valid token", async () => {
    const res = await request(app).get(`/api/documents/${documentId}/download`);
    expect(res.status).toBe(403);
  });
});
