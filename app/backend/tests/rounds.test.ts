import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

const dispatcherAgent = request.agent(app);
const driverAgent = request.agent(app);
const otherDriverAgent = request.agent(app);

let driverId: string;
let roundId: string;
let stopIds: string[] = [];

beforeAll(async () => {
  await dispatcherAgent.post("/api/auth/register").send({
    email: "disp@jtransport.test",
    password: "password123",
    name: "Centrale Nord",
    role: "DISPATCHER",
  });
  const driver = await driverAgent.post("/api/auth/register").send({
    email: "driver@jtransport.test",
    password: "password123",
    name: "Karim Livreur",
    role: "CHAUFFEUR",
  });
  driverId = driver.body.user.id;
  await otherDriverAgent.post("/api/auth/register").send({
    email: "driver2@jtransport.test",
    password: "password123",
    name: "Autre Livreur",
    role: "CHAUFFEUR",
  });
});

describe("dispatch rounds", () => {
  it("blocks a driver from creating a round", async () => {
    const res = await driverAgent.post("/api/rounds").send({
      date: "2026-09-20",
      stops: [{ label: "Paris 75001", address: "1 rue de Rivoli" }],
    });
    expect(res.status).toBe(403);
  });

  it("lets a dispatcher create a round with ordered stops", async () => {
    const res = await dispatcherAgent.post("/api/rounds").send({
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

  it("refuses to assign a round to a non-driver account", async () => {
    const me = await dispatcherAgent.get("/api/auth/me");
    const res = await dispatcherAgent.post(`/api/rounds/${roundId}/assign`).send({ driverId: me.body.user.id });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("NOT_A_DRIVER");
  });

  it("assigns the round to a driver", async () => {
    const res = await dispatcherAgent.post(`/api/rounds/${roundId}/assign`).send({ driverId });
    expect(res.status).toBe(200);
    expect(res.body.round.status).toBe("ASSIGNED");
  });

  it("shows the round to the assigned driver only", async () => {
    const mine = await driverAgent.get("/api/rounds/mine");
    expect(mine.body.rounds.some((r: { id: string }) => r.id === roundId)).toBe(true);

    const notMine = await otherDriverAgent.get("/api/rounds/mine");
    expect(notMine.body.rounds.length).toBe(0);

    const forbidden = await otherDriverAgent.get(`/api/rounds/${roundId}`);
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

  it("delivers a stop with a proof of delivery", async () => {
    const res = await driverAgent.post(`/api/rounds/${roundId}/stops/${stopIds[0]}/deliver`).send({
      podSignature: JSON.stringify([[{ x: 1, y: 1 }]]),
      podNote: "Remis en main propre",
    });
    expect(res.status).toBe(200);
    expect(res.body.stop.status).toBe("DELIVERED");
    expect(res.body.stop.completedAt).toBeTruthy();
  });

  it("records a failed delivery with its reason", async () => {
    const res = await driverAgent.post(`/api/rounds/${roundId}/stops/${stopIds[1]}/fail`).send({
      reason: "Destinataire absent",
    });
    expect(res.status).toBe(200);
    expect(res.body.stop.status).toBe("FAILED");
    expect(res.body.stop.failureReason).toBe("Destinataire absent");
  });

  it("completes the round once every stop is closed", async () => {
    await driverAgent.post(`/api/rounds/${roundId}/stops/${stopIds[2]}/deliver`).send({});
    const round = await driverAgent.get(`/api/rounds/${roundId}`);
    expect(round.body.round.status).toBe("COMPLETED");
  });

  it("gives the dispatcher real counters, not invented ones", async () => {
    const res = await dispatcherAgent.get("/api/rounds/dispatch-summary");
    expect(res.status).toBe(200);
    expect(res.body.summary.stopsToProcess).toBe(0);
    expect(res.body.summary.deliveredToday).toBe(2);
    expect(res.body.summary.activeRounds).toBe(0);
  });

  it("blocks another driver from touching the stops", async () => {
    const res = await otherDriverAgent.post(`/api/rounds/${roundId}/stops/${stopIds[0]}/deliver`).send({});
    expect(res.status).toBe(403);
  });
});
