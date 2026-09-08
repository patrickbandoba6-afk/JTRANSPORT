import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

const ownerAgent = request.agent(app);
const otherParticulierAgent = request.agent(app);
const carrierAgent = request.agent(app);

let missionId: string;
let offerId: string;

beforeAll(async () => {
  await ownerAgent.post("/api/auth/register").send({
    email: "owner@jtransport.test",
    password: "password123",
    name: "Owner",
    role: "PARTICULIER",
  });
  await otherParticulierAgent.post("/api/auth/register").send({
    email: "particulier2@jtransport.test",
    password: "password123",
    name: "Other Particulier",
    role: "PARTICULIER",
  });
  await carrierAgent.post("/api/auth/register").send({
    email: "carrier@jtransport.test",
    password: "password123",
    name: "Carrier",
    role: "TRANSPORTEUR",
  });
});

describe("missions marketplace", () => {
  it("requires auth to publish a mission", async () => {
    const res = await request(app).post("/api/missions").send({
      fromCity: "Paris",
      toCity: "Lyon",
      date: "2026-09-15",
      cargo: "8 palettes",
      weightKg: 2500,
      vehicleType: "Camion",
      budget: 650,
    });
    expect(res.status).toBe(401);
  });

  it("lets an authenticated user publish a mission", async () => {
    const res = await ownerAgent.post("/api/missions").send({
      fromCity: "Paris",
      toCity: "Lyon",
      date: "2026-09-15",
      cargo: "8 palettes",
      weightKg: 2500,
      vehicleType: "Camion",
      budget: 650,
    });
    expect(res.status).toBe(201);
    expect(res.body.mission.status).toBe("PUBLISHED");
    missionId = res.body.mission.id;
  });

  it("lists published missions publicly", async () => {
    const res = await request(app).get("/api/missions").query({ fromCity: "Paris" });
    expect(res.status).toBe(200);
    expect(res.body.missions.some((m: { id: string }) => m.id === missionId)).toBe(true);
  });

  it("rejects an offer from a non-transporteur role", async () => {
    const res = await otherParticulierAgent.post(`/api/missions/${missionId}/offers`).send({
      price: 600,
    });
    expect(res.status).toBe(403);
  });

  it("lets a transporteur submit an offer", async () => {
    const res = await carrierAgent.post(`/api/missions/${missionId}/offers`).send({
      price: 600,
      message: "Disponible dès le 14.",
    });
    expect(res.status).toBe(201);
    expect(res.body.offer.status).toBe("PENDING");
    offerId = res.body.offer.id;
  });

  it("blocks a second offer from the same provider", async () => {
    const res = await carrierAgent.post(`/api/missions/${missionId}/offers`).send({
      price: 590,
    });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("OFFER_ALREADY_SUBMITTED");
  });

  it("hides offers from anyone but the mission owner", async () => {
    const res = await carrierAgent.get(`/api/missions/${missionId}/offers`);
    expect(res.status).toBe(403);
  });

  it("lets the owner accept an offer, attributing the mission", async () => {
    const res = await ownerAgent.post(`/api/missions/${missionId}/offers/${offerId}/accept`);
    expect(res.status).toBe(200);
    expect(res.body.mission.status).toBe("ATTRIBUTED");

    const offers = await ownerAgent.get(`/api/missions/${missionId}/offers`);
    expect(offers.body.offers.find((o: { id: string }) => o.id === offerId).status).toBe(
      "ACCEPTED",
    );
  });

  it("refuses new offers once the mission is attributed", async () => {
    const res = await carrierAgent.post(`/api/missions/${missionId}/offers`).send({
      price: 500,
    });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("MISSION_NOT_OPEN");
  });
});
