const request = require("supertest");
const app = require("../app");

describe("Routes utilitaires", () => {
  it("GET /health → 200 + { ok: true }", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("GET / → 200 + message API", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
  });
});
