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
let codes: string[] = [];

beforeAll(async () => {
  await companyAgent.post("/api/auth/register").send({
    email: "parcel-company@jtransport.test",
    password: "password123",
    name: "Colis Express",
    role: "PROFESSIONNEL",
  });
  const driver = await driverAgent.post("/api/auth/register").send({
    email: "parcel-driver@jtransport.test",
    password: "password123",
    name: "Sonia Livreuse",
    role: "TRANSPORTEUR",
  });
  driverId = driver.body.user.id;
  await outsiderAgent.post("/api/auth/register").send({
    email: "parcel-outsider@jtransport.test",
    password: "password123",
    name: "Curieux",
    role: "PARTICULIER",
  });

  const org = await companyAgent.post("/api/organizations").send({
    name: "Colis Express SAS",
    activity: "LOGISTIQUE",
    country: "FR",
    hasProfessionalCapacity: false,
  });
  organizationId = org.body.organization.id;

  await companyAgent.post(`/api/organizations/${organizationId}/members`).send({
    email: "parcel-driver@jtransport.test",
    role: "CHAUFFEUR",
  });

  const round = await companyAgent.post("/api/rounds").send({ organizationId, date: "2026-09-21", stops: [] });
  roundId = round.body.round.id;
  await companyAgent.post(`/api/rounds/${roundId}/assign`).send({ driverId });
});

describe("parcel chain of custody", () => {
  it("creates parcels held by the company, each with its own tracking code", async () => {
    const res = await companyAgent.post("/api/parcels").send({
      organizationId,
      parcels: [
        { description: "Carton A", weightKg: 2, recipientName: "Client 1", recipientAddress: "1 rue A" },
        { description: "Carton B", weightKg: 3, recipientName: "Client 2", recipientAddress: "2 rue B" },
        { description: "Carton C", weightKg: 1, recipientName: "Client 3", recipientAddress: "3 rue C" },
      ],
    });
    expect(res.status).toBe(201);
    expect(res.body.parcels.length).toBe(3);
    expect(res.body.parcels[0].status).toBe("READY_TO_DISPATCH");
    expect(res.body.parcels[0].custodianType).toBe("ORGANIZATION");
    codes = res.body.parcels.map((p: { code: string }) => p.code);
    expect(new Set(codes).size).toBe(3);
  });

  it("blocks an outsider from listing the company's parcels", async () => {
    const res = await outsiderAgent.get("/api/parcels").query({ organizationId });
    expect(res.status).toBe(403);
  });

  it("hands the parcels over to the carrier round, recording the transfer", async () => {
    const parcels = await companyAgent.get("/api/parcels").query({ organizationId });
    const ids = parcels.body.parcels.map((p: { id: string }) => p.id);

    const res = await companyAgent.post("/api/parcels/assign").send({ roundId, parcelIds: ids });
    expect(res.status).toBe(200);
    expect(res.body.assigned).toBe(3);

    const trace = await companyAgent.get(`/api/parcels/${codes[0]}/trace`);
    expect(trace.body.parcel.status).toBe("ASSIGNED");
    expect(trace.body.parcel.custodianType).toBe("CARRIER");
    expect(trace.body.parcel.events.map((e: { type: string }) => e.type)).toContain("ASSIGNED_TO_CARRIER");
  });

  it("refuses to hand over a parcel that already left", async () => {
    const parcels = await companyAgent.get("/api/parcels").query({ organizationId });
    const ids = parcels.body.parcels.map((p: { id: string }) => p.id);
    const res = await companyAgent.post("/api/parcels/assign").send({ roundId, parcelIds: ids });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("PARCEL_NOT_ASSIGNABLE");
  });

  it("moves custody to the driver when they scan the parcel", async () => {
    const res = await driverAgent.post("/api/parcels/scan").send({ code: codes[0], location: "Dépôt Nord" });
    expect(res.status).toBe(200);
    expect(res.body.parcel.status).toBe("PICKED_UP");
    expect(res.body.parcel.custodianType).toBe("DRIVER");
  });

  it("blocks a driver from scanning a parcel that isn't on their round", async () => {
    const res = await outsiderAgent.post("/api/parcels/scan").send({ code: codes[1] });
    expect(res.status).toBe(403);
  });

  it("requires a proof of delivery to mark a parcel delivered", async () => {
    const res = await driverAgent.post("/api/parcels/deliver").send({ code: codes[0] });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("PROOF_REQUIRED");
  });

  it("delivers a parcel with its proof", async () => {
    const res = await driverAgent.post("/api/parcels/deliver").send({
      code: codes[0],
      recipientName: "Client 1",
      signature: JSON.stringify([[{ x: 2, y: 2 }]]),
      location: "1 rue A",
    });
    expect(res.status).toBe(200);
    expect(res.body.parcel.status).toBe("DELIVERED");
    expect(res.body.parcel.custodianType).toBe("RECIPIENT");
  });

  it("records a failed attempt and a return, both with a stated reason", async () => {
    const attempt = await driverAgent.post("/api/parcels/delivery-failed").send({
      code: codes[1],
      reason: "Destinataire absent",
    });
    expect(attempt.body.parcel.status).toBe("IN_DELIVERY");

    const returned = await driverAgent.post("/api/parcels/delivery-failed").send({
      code: codes[1],
      reason: "Deuxième échec — retour dépôt",
      returned: true,
    });
    expect(returned.body.parcel.status).toBe("RETURNED");

    const trace = await companyAgent.get(`/api/parcels/${codes[1]}/trace`);
    const types = trace.body.parcel.events.map((e: { type: string }) => e.type);
    expect(types.filter((t: string) => t === "DELIVERY_ATTEMPT").length).toBe(2);
    expect(types).toContain("RETURNED");
  });

  it("reconciles the round and opens an incident for the unaccounted parcel — never a theft", async () => {
    const res = await companyAgent.post("/api/parcels/reconcile").send({ roundId });
    expect(res.status).toBe(200);
    expect(res.body.reconciliation).toMatchObject({
      handedOver: 3,
      delivered: 1,
      returned: 1,
      unaccounted: 1,
      incidentsOpened: 1,
    });

    const trace = await companyAgent.get(`/api/parcels/${codes[2]}/trace`);
    expect(trace.body.parcel.status).toBe("INCIDENT");
    expect(trace.body.parcel.incidents[0].status).toBe("NON_LOCALISE");
  });

  it("keeps the full history: every step is still readable afterwards", async () => {
    const trace = await companyAgent.get(`/api/parcels/${codes[0]}/trace`);
    const types = trace.body.parcel.events.map((e: { type: string }) => e.type);
    expect(types).toEqual(["CREATED", "READY_TO_DISPATCH", "ASSIGNED_TO_CARRIER", "PICKED_UP", "DELIVERED"]);
    expect(trace.body.parcel.events.every((e: { actorLabel: string | null }) => e.actorLabel)).toBe(true);
  });

  it("lets a driver report an incident but never self-declare a theft", async () => {
    const reported = await driverAgent.post(`/api/parcels/${codes[1]}/incidents`).send({
      reason: "Emballage abîmé constaté au retour",
    });
    expect(reported.status).toBe(201);
    expect(reported.body.incident.status).toBe("SIGNALE");

    const theft = await driverAgent.post(`/api/parcels/${codes[1]}/incidents`).send({
      reason: "Vol",
      status: "VOL_CONFIRME",
    });
    expect(theft.status).toBe(403);
  });

  it("lets the company escalate and resolve an incident", async () => {
    const trace = await companyAgent.get(`/api/parcels/${codes[2]}/trace`);
    const incidentId = trace.body.parcel.incidents[0].id;

    const escalated = await companyAgent.patch(`/api/parcels/incidents/${incidentId}`).send({
      status: "EN_INVESTIGATION",
    });
    expect(escalated.body.incident.status).toBe("EN_INVESTIGATION");

    const resolved = await companyAgent.patch(`/api/parcels/incidents/${incidentId}`).send({
      status: "RESOLU",
      resolution: "Colis retrouvé au dépôt",
    });
    expect(resolved.body.incident.status).toBe("RESOLU");
    expect(resolved.body.incident.resolvedAt).toBeTruthy();
  });
});
