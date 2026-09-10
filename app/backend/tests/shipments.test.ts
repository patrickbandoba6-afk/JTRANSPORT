import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

const clientAgent = request.agent(app);
const strangerAgent = request.agent(app);
const adminAgent = request.agent(app);

let shipmentId: string;
let containerId: string;

beforeAll(async () => {
  await clientAgent.post("/api/auth/register").send({
    email: "ship-client@jtransport.test",
    password: "password123",
    name: "Ship Client",
    role: "PARTICULIER",
  });
  await strangerAgent.post("/api/auth/register").send({
    email: "ship-stranger@jtransport.test",
    password: "password123",
    name: "Ship Stranger",
    role: "PARTICULIER",
  });
  const adminRegister = await adminAgent.post("/api/auth/register").send({
    email: "ship-admin@jtransport.test",
    password: "password123",
    name: "Ship Admin",
    role: "PARTICULIER",
  });
  // Self-registration can never grant ADMIN — promote directly via Prisma,
  // simulating the out-of-band process a real admin-invite flow would use.
  const { PrismaClient } = await import("@prisma/client");
  const { DEFAULT_CUSTOMS_REQUIREMENTS } = await import("../src/data/customsRequirements.js");
  const prisma = new PrismaClient();
  await prisma.user.update({ where: { id: adminRegister.body.user.id }, data: { role: "ADMIN" } });
  // Reference data the app expects to exist (normally loaded by the seed).
  if ((await prisma.customsRequirement.count()) === 0) {
    for (const r of DEFAULT_CUSTOMS_REQUIREMENTS) await prisma.customsRequirement.create({ data: r });
  }
  await prisma.$disconnect();
  // Re-login so the session token carries the promoted role.
  await adminAgent.post("/api/auth/login").send({ email: "ship-admin@jtransport.test", password: "password123" });
});

describe("auth self-registration", () => {
  it("rejects ADMIN as a self-registration role", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "sneaky-admin@jtransport.test",
      password: "password123",
      name: "Sneaky",
      role: "ADMIN",
    });
    expect(res.status).toBe(400);
  });
});

describe("shipments", () => {
  it("creates an international shipment with an auto-opened customs case", async () => {
    const res = await clientAgent.post("/api/shipments").send({
      originCity: "Paris",
      originCountry: "FR",
      destinationCity: "Dakar",
      destinationCountry: "SN",
      recipientName: "Fatou Diop",
      recipientAddress: "12 rue de la Paix, Dakar",
      parcels: [{ description: "Vêtements", weightKg: 12 }],
    });
    expect(res.status).toBe(201);
    expect(res.body.shipment.status).toBe("CREATED");
    expect(res.body.shipment.customsCase).toBeTruthy();
    expect(res.body.shipment.parcels.length).toBe(1);
    shipmentId = res.body.shipment.id;
  });

  it("does not open a customs case for a domestic shipment", async () => {
    const res = await clientAgent.post("/api/shipments").send({
      originCity: "Paris",
      originCountry: "FR",
      destinationCity: "Lyon",
      destinationCountry: "FR",
      recipientName: "Jean Dupont",
      recipientAddress: "1 rue de Lyon",
      parcels: [{ description: "Documents", weightKg: 1 }],
    });
    expect(res.status).toBe(201);
    expect(res.body.shipment.customsCase).toBeNull();
  });

  it("blocks a stranger from viewing someone else's shipment", async () => {
    const res = await strangerAgent.get(`/api/shipments/${shipmentId}`);
    expect(res.status).toBe(403);
  });

  it("blocks a non-admin from adding a tracking event", async () => {
    const res = await clientAgent.post(`/api/shipments/${shipmentId}/events`).send({ type: "COLLECTED" });
    expect(res.status).toBe(403);
  });

  it("lets an admin add a real tracking event, updating shipment status", async () => {
    const res = await adminAgent.post(`/api/shipments/${shipmentId}/events`).send({
      type: "COLLECTED",
      location: "Entrepôt Paris",
    });
    expect(res.status).toBe(201);
    expect(res.body.shipment.status).toBe("COLLECTED");

    const detail = await clientAgent.get(`/api/shipments/${shipmentId}`);
    expect(detail.body.shipment.events.some((e: { type: string }) => e.type === "COLLECTED")).toBe(true);
  });

  it("blocks a non-admin from creating a container", async () => {
    const res = await clientAgent.post("/api/containers").send({
      containerNumber: "MSCU1234567",
      type: "FCL_20",
      originPort: "Le Havre",
      destinationPort: "Dakar",
    });
    expect(res.status).toBe(403);
  });

  it("lets an admin create a container and assign the shipment to it", async () => {
    const container = await adminAgent.post("/api/containers").send({
      containerNumber: "MSCU1234567",
      type: "FCL_20",
      originPort: "Le Havre",
      destinationPort: "Dakar",
    });
    expect(container.status).toBe(201);
    containerId = container.body.container.id;

    const assign = await adminAgent.post(`/api/shipments/${shipmentId}/assign-container`).send({ containerId });
    expect(assign.status).toBe(200);
    expect(assign.body.shipment.containerId).toBe(containerId);
    expect(assign.body.shipment.status).toBe("IN_CONTAINER");
  });

  it("propagates a container status update to its shipments", async () => {
    const res = await adminAgent.patch(`/api/containers/${containerId}`).send({ status: "DEPARTED" });
    expect(res.status).toBe(200);

    const shipment = await clientAgent.get(`/api/shipments/${shipmentId}`);
    expect(shipment.body.shipment.status).toBe("DEPARTED");
    expect(shipment.body.shipment.events.some((e: { type: string }) => e.type === "DEPARTED")).toBe(true);
  });

  it("lets an admin update the customs case with estimate-only fees", async () => {
    const res = await adminAgent.patch(`/api/shipments/${shipmentId}/customs-case`).send({
      status: "UNDER_REVIEW",
      estimatedFees: 45.5,
      hsCode: "6109.10",
    });
    expect(res.status).toBe(200);
    expect(res.body.customsCase.status).toBe("UNDER_REVIEW");
    expect(res.body.customsCase.estimatedFees).toBe(45.5);
  });

  it("carries a transport mode and a cargo type, vehicles included", async () => {
    const res = await clientAgent.post("/api/shipments").send({
      originCity: "Marseille",
      originCountry: "FR",
      destinationCity: "Abidjan",
      destinationCountry: "CI",
      recipientName: "Koffi",
      recipientAddress: "Rue du Port, Abidjan",
      mode: "MARITIME",
      cargoType: "VEHICULE",
      vehicles: [{ make: "Peugeot", model: "208", year: 2019, vin: "VF3XXXXXXXX", condition: "ROULANT" }],
    });
    expect(res.status).toBe(201);
    expect(res.body.shipment.mode).toBe("MARITIME");
    expect(res.body.shipment.vehicles.length).toBe(1);

    // A maritime vehicle export asks for the B/L and the vehicle papers.
    const reqs = await clientAgent.get(`/api/shipments/${res.body.shipment.id}/requirements`);
    expect(reqs.status).toBe(200);
    const labels = reqs.body.checklist.map((c: { label: string }) => c.label);
    expect(labels).toContain("Connaissement maritime (B/L)");
    expect(labels).toContain("Carte grise / certificat d'immatriculation");
    expect(labels).not.toContain("Lettre de transport aérien (AWB)");
    expect(reqs.body.missingMandatory).toBeGreaterThan(0);
    expect(reqs.body.international).toBe(true);
  });

  it("keeps an estimate and an officially notified customs amount apart", async () => {
    const res = await adminAgent.patch(`/api/shipments/${shipmentId}/customs-case`).send({
      officialFees: 512.4,
      feesStatus: "OFFICIAL",
    });
    expect(res.status).toBe(200);
    expect(res.body.customsCase.estimatedFees).toBe(45.5);
    expect(res.body.customsCase.officialFees).toBe(512.4);
    expect(res.body.customsCase.feesStatus).toBe("OFFICIAL");
  });

  it("lists the client's own shipments", async () => {
    const res = await clientAgent.get("/api/shipments/mine");
    expect(res.status).toBe(200);
    expect(res.body.shipments.some((s: { id: string }) => s.id === shipmentId)).toBe(true);
  });
});
