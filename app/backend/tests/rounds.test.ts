import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

const companyAgent = request.agent(app);
const driverAgent = request.agent(app);
const outsiderAgent = request.agent(app);

let organizationId: string;
let driverId: string;
let roundId: string;
let stopIds: string[] = [];

beforeAll(async () => {
  await companyAgent.post("/api/auth/register").send({
    email: "round-company@jtransport.test",
    password: "password123",
    name: "Logistique Nord",
    role: "PROFESSIONNEL",
  });
  const driver = await driverAgent.post("/api/auth/register").send({
    email: "round-driver@jtransport.test",
    password: "password123",
    name: "Karim Livreur",
    role: "TRANSPORTEUR",
  });
  driverId = driver.body.user.id;
  await outsiderAgent.post("/api/auth/register").send({
    email: "round-outsider@jtransport.test",
    password: "password123",
    name: "Outsider",
    role: "TRANSPORTEUR",
  });

  const org = await companyAgent.post("/api/organizations").send({
    name: "Logistique Nord SAS",
    activity: "LOGISTIQUE",
    country: "FR",
    hasProfessionalCapacity: false,
  });
  organizationId = org.body.organization.id;
});

describe("company team", () => {
  it("refuses to add someone who has no JTransport account yet", async () => {
    const res = await companyAgent.post(`/api/organizations/${organizationId}/members`).send({
      email: "ghost@jtransport.test",
      role: "CHAUFFEUR",
    });
    expect(res.status).toBe(404);
  });

  it("adds an independent driver to the company team as CHAUFFEUR", async () => {
    const res = await companyAgent.post(`/api/organizations/${organizationId}/members`).send({
      email: "round-driver@jtransport.test",
      role: "CHAUFFEUR",
    });
    expect(res.status).toBe(201);
    expect(res.body.member.role).toBe("CHAUFFEUR");
  });

  it("blocks an outsider from reading the team", async () => {
    const res = await outsiderAgent.get(`/api/organizations/${organizationId}/members`);
    expect(res.status).toBe(403);
  });
});

describe("dispatch rounds", () => {
  it("blocks a non-member from creating a round for the company", async () => {
    const res = await outsiderAgent.post("/api/rounds").send({
      organizationId,
      date: "2026-09-20",
      stops: [{ label: "Paris 75001", address: "1 rue de Rivoli" }],
    });
    expect(res.status).toBe(403);
  });

  it("lets the company create a round with ordered stops", async () => {
    const res = await companyAgent.post("/api/rounds").send({
      organizationId,
      date: "2026-09-20",
      stops: [
        { label: "Paris 75001", address: "1 rue de Rivoli", parcelCode: "JT-C-001" },
        { label: "Saint-Denis 93200", address: "5 rue Gabriel Péri", parcelCode: "JT-C-002" },
        { label: "Aubervilliers 93300", address: "12 avenue Victor Hugo" },
      ],
    });
    expect(res.status).toBe(201);
    expect(res.body.round.reference).toMatch(/^TRN-\d{4}-\d{4}$/);
    expect(res.body.round.stops.map((s: { position: number }) => s.position)).toEqual([1, 2, 3]);
    roundId = res.body.round.id;
    stopIds = res.body.round.stops.map((s: { id: string }) => s.id);
  });

  it("refuses to assign the round to someone who isn't a driver of the company", async () => {
    const outsider = await outsiderAgent.get("/api/auth/me");
    const res = await companyAgent.post(`/api/rounds/${roundId}/assign`).send({ driverId: outsider.body.user.id });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("NOT_A_DRIVER");
  });

  it("assigns the round to the company's driver", async () => {
    const res = await companyAgent.post(`/api/rounds/${roundId}/assign`).send({ driverId });
    expect(res.status).toBe(200);
    expect(res.body.round.status).toBe("ASSIGNED");
  });

  it("shows the round to the driver and hides it from outsiders", async () => {
    const mine = await driverAgent.get("/api/rounds/mine");
    expect(mine.body.rounds.some((r: { id: string }) => r.id === roundId)).toBe(true);

    const forbidden = await outsiderAgent.get(`/api/rounds/${roundId}`);
    expect(forbidden.status).toBe(403);
  });

  it("rejects a scan whose parcel code doesn't match the stop", async () => {
    const res = await driverAgent.post(`/api/rounds/${roundId}/stops/${stopIds[0]}/scan`).send({ parcelCode: "WRONG" });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("PARCEL_CODE_MISMATCH");
  });

  it("records a scan and moves the round to IN_PROGRESS", async () => {
    const res = await driverAgent.post(`/api/rounds/${roundId}/stops/${stopIds[0]}/scan`).send({ parcelCode: "JT-C-001" });
    expect(res.status).toBe(200);
    expect(res.body.stop.status).toBe("IN_PROGRESS");

    const round = await driverAgent.get(`/api/rounds/${roundId}`);
    expect(round.body.round.status).toBe("IN_PROGRESS");
    expect(round.body.round.stops[0].events.some((e: { type: string }) => e.type === "SCANNED")).toBe(true);
  });

  it("delivers a stop with a proof of delivery, fails another with a reason", async () => {
    const delivered = await driverAgent.post(`/api/rounds/${roundId}/stops/${stopIds[0]}/deliver`).send({
      podSignature: JSON.stringify([[{ x: 1, y: 1 }]]),
      podNote: "Remis en main propre",
    });
    expect(delivered.body.stop.status).toBe("DELIVERED");

    const failed = await driverAgent.post(`/api/rounds/${roundId}/stops/${stopIds[1]}/fail`).send({
      reason: "Destinataire absent",
    });
    expect(failed.body.stop.status).toBe("FAILED");
    expect(failed.body.stop.failureReason).toBe("Destinataire absent");
  });

  it("completes the round once every stop is closed", async () => {
    await driverAgent.post(`/api/rounds/${roundId}/stops/${stopIds[2]}/deliver`).send({});
    const round = await driverAgent.get(`/api/rounds/${roundId}`);
    expect(round.body.round.status).toBe("COMPLETED");
  });

  it("blocks another carrier from touching the stops", async () => {
    const res = await outsiderAgent.post(`/api/rounds/${roundId}/stops/${stopIds[0]}/deliver`).send({});
    expect(res.status).toBe(403);
  });

  it("lists the company's drivers for the dispatcher", async () => {
    const res = await companyAgent.get("/api/rounds/drivers").query({ organizationId });
    expect(res.status).toBe(200);
    expect(res.body.drivers.some((d: { id: string }) => d.id === driverId)).toBe(true);
  });
});
