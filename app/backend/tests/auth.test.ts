import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

describe("auth", () => {
  it("registers a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "new.user@jtransport.test",
      password: "password123",
      name: "New User",
      role: "PARTICULIER",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("new.user@jtransport.test");
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(typeof res.body.token).toBe("string");
  });

  it("rejects registration with a duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      email: "dup@jtransport.test",
      password: "password123",
      name: "Dup",
      role: "PARTICULIER",
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "dup@jtransport.test",
      password: "password123",
      name: "Dup 2",
      role: "PARTICULIER",
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("EMAIL_ALREADY_USED");
  });

  it("rejects login with a wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      email: "wrongpass@jtransport.test",
      password: "password123",
      name: "Wrong Pass",
      role: "PARTICULIER",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "wrongpass@jtransport.test",
      password: "not-the-password",
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("INVALID_CREDENTIALS");
  });

  it("rejects /me without a token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns the current user for a valid token", async () => {
    const agent = request.agent(app);
    await agent.post("/api/auth/register").send({
      email: "me@jtransport.test",
      password: "password123",
      name: "Me",
      role: "TRANSPORTEUR",
    });

    const res = await agent.get("/api/auth/me");
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("me@jtransport.test");
    expect(res.body.user.role).toBe("TRANSPORTEUR");
  });
});
