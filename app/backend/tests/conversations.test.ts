import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

const clientAgent = request.agent(app);
const carrierAgent = request.agent(app);
const strangerAgent = request.agent(app);

let carrierId: string;
let conversationId: string;

beforeAll(async () => {
  await clientAgent.post("/api/auth/register").send({
    email: "msg-client@jtransport.test",
    password: "password123",
    name: "Msg Client",
    role: "PARTICULIER",
  });
  const carrier = await carrierAgent.post("/api/auth/register").send({
    email: "msg-carrier@jtransport.test",
    password: "password123",
    name: "Msg Carrier",
    role: "TRANSPORTEUR",
  });
  carrierId = carrier.body.user.id;
  await strangerAgent.post("/api/auth/register").send({
    email: "msg-stranger@jtransport.test",
    password: "password123",
    name: "Msg Stranger",
    role: "PARTICULIER",
  });
});

describe("conversations", () => {
  it("refuses a conversation with yourself", async () => {
    const me = await clientAgent.get("/api/auth/me");
    const res = await clientAgent.post("/api/conversations").send({ participantId: me.body.user.id });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("CANNOT_MESSAGE_SELF");
  });

  it("opens a conversation with a first message", async () => {
    const res = await clientAgent.post("/api/conversations").send({
      participantId: carrierId,
      subject: "Devis Paris → Lyon",
      message: "Bonjour, êtes-vous disponible le 15 ?",
    });
    expect(res.status).toBe(201);
    conversationId = res.body.conversation.id;
  });

  it("reuses the same thread instead of creating a duplicate", async () => {
    const res = await clientAgent.post("/api/conversations").send({ participantId: carrierId });
    expect(res.status).toBe(200);
    expect(res.body.conversation.id).toBe(conversationId);
  });

  it("shows the conversation to both participants", async () => {
    const asClient = await clientAgent.get("/api/conversations");
    expect(asClient.body.conversations.some((c: { id: string }) => c.id === conversationId)).toBe(true);
    const asCarrier = await carrierAgent.get("/api/conversations");
    expect(asCarrier.body.conversations.some((c: { id: string }) => c.id === conversationId)).toBe(true);
  });

  it("blocks a non-participant from reading the messages", async () => {
    const res = await strangerAgent.get(`/api/conversations/${conversationId}/messages`);
    expect(res.status).toBe(403);
  });

  it("blocks a non-participant from posting into the thread", async () => {
    const res = await strangerAgent.post(`/api/conversations/${conversationId}/messages`).send({ body: "coucou" });
    expect(res.status).toBe(403);
  });

  it("lets the other participant reply and both read the thread", async () => {
    const reply = await carrierAgent.post(`/api/conversations/${conversationId}/messages`).send({
      body: "Bonjour, oui je suis disponible.",
    });
    expect(reply.status).toBe(201);

    const thread = await clientAgent.get(`/api/conversations/${conversationId}/messages`);
    expect(thread.status).toBe(200);
    expect(thread.body.messages.length).toBe(2);
    expect(thread.body.messages[0].sender.name).toBe("Msg Client");
    expect(thread.body.messages[1].sender.name).toBe("Msg Carrier");
  });

  it("rejects an empty message", async () => {
    const res = await clientAgent.post(`/api/conversations/${conversationId}/messages`).send({ body: "" });
    expect(res.status).toBe(400);
  });
});
