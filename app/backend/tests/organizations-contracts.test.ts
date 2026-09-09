import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

const ownerAgent = request.agent(app);
const carrierAgent = request.agent(app);

let organizationId: string;
let capacityId: string;
let missionId: string;
let offerId: string;
let contractId: string;

beforeAll(async () => {
  await ownerAgent.post("/api/auth/register").send({
    email: "org-owner@jtransport.test",
    password: "password123",
    name: "Org Owner",
    role: "PARTICULIER",
  });
  await carrierAgent.post("/api/auth/register").send({
    email: "org-carrier@jtransport.test",
    password: "password123",
    name: "Org Carrier",
    role: "TRANSPORTEUR",
  });

  const mission = await ownerAgent.post("/api/missions").send({
    fromCity: "Lille",
    toCity: "Bruxelles",
    date: "2026-11-01",
    cargo: "25 colis",
    weightKg: 420,
    vehicleType: "Fourgon",
    budget: 290,
  });
  missionId = mission.body.mission.id;

  const offer = await carrierAgent.post(`/api/missions/${missionId}/offers`).send({ price: 270 });
  offerId = offer.body.offer.id;

  await ownerAgent.post(`/api/missions/${missionId}/offers/${offerId}/accept`);
});

describe("organizations & capacities", () => {
  it("creates an organization without granting professional capacity", async () => {
    const res = await carrierAgent.post("/api/organizations").send({
      name: "Transports Diallo",
      activity: "MARCHANDISES",
      country: "FR",
      hasProfessionalCapacity: false,
    });
    expect(res.status).toBe(201);
    expect(res.body.organization.verificationStatus).toBe("UNVERIFIED");
    organizationId = res.body.organization.id;
  });

  it("rejects a capacity published by someone other than the org owner", async () => {
    const res = await ownerAgent.post(`/api/organizations/${organizationId}/capacities`).send({
      vehicleType: "Camion",
      weightCapacityKg: 3000,
      zone: "France",
      availableFrom: "2026-09-10",
    });
    expect(res.status).toBe(403);
  });

  it("lets the org owner publish a capacity, visible on the public marketplace", async () => {
    const res = await carrierAgent.post(`/api/organizations/${organizationId}/capacities`).send({
      vehicleType: "Camion",
      weightCapacityKg: 3000,
      zone: "France",
      availableFrom: "2026-09-10",
    });
    expect(res.status).toBe(201);
    capacityId = res.body.capacity.id;

    const list = await request(app).get("/api/capacities").query({ zone: "France" });
    expect(list.body.capacities.some((c: { organizationId: string }) => c.organizationId === organizationId)).toBe(
      true,
    );
  });
});

describe("contracts from a capacity (louer sa capacité)", () => {
  it("blocks the capacity owner from contracting their own capacity", async () => {
    const res = await carrierAgent.post("/api/contracts").send({ capacityId, price: 800 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("CANNOT_CONTRACT_OWN_CAPACITY");
  });

  it("lets a requester open a contract directly from a published capacity, at a negotiated price", async () => {
    const res = await ownerAgent.post("/api/contracts").send({ capacityId, price: 950, terms: "3 mois renouvelable" });
    expect(res.status).toBe(201);
    expect(res.body.contract.status).toBe("SENT");
    expect(res.body.contract.price).toBe(950);
    expect(res.body.contract.capacityId).toBe(capacityId);
    expect(res.body.contract.counterpartyId).toBeTruthy();

    const bothSignedOk = await ownerAgent.post(`/api/contracts/${res.body.contract.id}/sign`);
    expect(bothSignedOk.status).toBe(200);
  });
});

describe("contracts", () => {
  it("blocks contract generation from a non-accepted offer's owner", async () => {
    const res = await carrierAgent.post("/api/contracts").send({ offerId });
    expect(res.status).toBe(403);
  });

  it("lets the mission owner generate a contract from the accepted offer", async () => {
    const res = await ownerAgent.post("/api/contracts").send({ offerId });
    expect(res.status).toBe(201);
    expect(res.body.contract.status).toBe("SENT");
    contractId = res.body.contract.id;
  });

  it("refuses a second contract for the same mission", async () => {
    const res = await ownerAgent.post("/api/contracts").send({ offerId });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("CONTRACT_ALREADY_EXISTS");
  });

  it("moves to PARTIALLY_SIGNED after the first signature", async () => {
    const res = await ownerAgent.post(`/api/contracts/${contractId}/sign`);
    expect(res.status).toBe(200);
    expect(res.body.contract.status).toBe("PARTIALLY_SIGNED");
  });

  it("blocks a duplicate signature from the same party", async () => {
    const res = await ownerAgent.post(`/api/contracts/${contractId}/sign`);
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("ALREADY_SIGNED");
  });

  it("fully signs and confirms the mission once both parties sign", async () => {
    const res = await carrierAgent.post(`/api/contracts/${contractId}/sign`);
    expect(res.status).toBe(200);
    expect(res.body.contract.status).toBe("FULLY_SIGNED");

    const mission = await request(app).get(`/api/missions/${missionId}`);
    expect(mission.body.mission.status).toBe("CONFIRMED");
  });
});
