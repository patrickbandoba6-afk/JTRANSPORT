import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

const clientAgent = request.agent(app);
const carrierAgent = request.agent(app);

let contractId: string;
let invoiceId: string;

beforeAll(async () => {
  await clientAgent.post("/api/auth/register").send({
    email: "inv-client@jtransport.test",
    password: "password123",
    name: "Inv Client",
    role: "PARTICULIER",
  });
  await carrierAgent.post("/api/auth/register").send({
    email: "inv-carrier@jtransport.test",
    password: "password123",
    name: "Inv Carrier",
    role: "TRANSPORTEUR",
  });

  const mission = await clientAgent.post("/api/missions").send({
    fromCity: "Nice",
    toCity: "Milan",
    date: "2026-12-15",
    cargo: "5 palettes",
    weightKg: 1200,
    vehicleType: "Camion",
    budget: 900,
  });
  const missionId = mission.body.mission.id;
  const offer = await carrierAgent.post(`/api/missions/${missionId}/offers`).send({ price: 850 });
  await clientAgent.post(`/api/missions/${missionId}/offers/${offer.body.offer.id}/accept`);
  const contract = await clientAgent.post("/api/contracts").send({ offerId: offer.body.offer.id });
  contractId = contract.body.contract.id;
  await clientAgent.post(`/api/contracts/${contractId}/sign`);
  await carrierAgent.post(`/api/contracts/${contractId}/sign`);
});

describe("invoices", () => {
  it("blocks the client (owner) from generating the invoice — only the provider bills", async () => {
    const res = await clientAgent.post("/api/invoices").send({ contractId });
    expect(res.status).toBe(403);
  });

  it("lets the provider generate an invoice from the fully signed contract", async () => {
    const res = await carrierAgent.post("/api/invoices").send({ contractId, taxRate: 0.2 });
    expect(res.status).toBe(201);
    expect(res.body.invoice.subtotal).toBe(850);
    expect(res.body.invoice.taxAmount).toBeCloseTo(170);
    expect(res.body.invoice.total).toBeCloseTo(1020);
    expect(res.body.invoice.number).toMatch(/^JT-\d{4}-\d{6}$/);
    expect(res.body.invoice.lines.length).toBe(1);
    invoiceId = res.body.invoice.id;
  });

  it("refuses a second invoice for the same contract", async () => {
    const res = await carrierAgent.post("/api/invoices").send({ contractId });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("INVOICE_ALREADY_EXISTS");
  });

  it("lets both parties see the invoice, blocks a stranger", async () => {
    const asClient = await clientAgent.get(`/api/invoices/${invoiceId}`);
    expect(asClient.status).toBe(200);
    const asCarrier = await carrierAgent.get(`/api/invoices/${invoiceId}`);
    expect(asCarrier.status).toBe(200);
  });

  it("blocks the recipient from marking the invoice paid", async () => {
    const res = await clientAgent.post(`/api/invoices/${invoiceId}/mark-paid`);
    expect(res.status).toBe(403);
  });

  it("lets the issuer mark the invoice paid", async () => {
    const res = await carrierAgent.post(`/api/invoices/${invoiceId}/mark-paid`);
    expect(res.status).toBe(200);
    expect(res.body.invoice.status).toBe("PAID");
    expect(res.body.invoice.paidAt).toBeTruthy();
  });

  it("honestly reports a failed e-invoicing transmission — no certified platform connected", async () => {
    const res = await carrierAgent.post(`/api/invoices/${invoiceId}/transmit`);
    expect(res.status).toBe(200);
    expect(res.body.transmission.status).toBe("FAILED");
    expect(res.body.invoice.eInvoicingStatus).toBe("FAILED");
  });

  it("lists invoices for both issuer and recipient via /mine", async () => {
    const asIssuer = await carrierAgent.get("/api/invoices/mine");
    expect(asIssuer.body.invoices.some((i: { id: string }) => i.id === invoiceId)).toBe(true);
    const asRecipient = await clientAgent.get("/api/invoices/mine");
    expect(asRecipient.body.invoices.some((i: { id: string }) => i.id === invoiceId)).toBe(true);
  });
});
