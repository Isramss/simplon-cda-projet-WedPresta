process.env.JWT_SECRET = "test-secret";

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

describe("Auth routes", () => {
  test("GET /api/auth/test -> 200", async () => {
    const res = await request(app).get("/api/auth/test");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Route auth OK");
  });

  test("GET /api/auth/profile -> 401 si pas de token", async () => {
    const res = await request(app).get("/api/auth/profile");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Token manquant");
  });

  test("GET /api/auth/profile -> 403 si token invalide", async () => {
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", "Bearer token-invalide");

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message", "Token invalide ou expiré");
  });

  test("GET /api/auth/profile -> 200 si token valide + renvoie user", async () => {
    const payload = { id_utilisateur: 1, role: "ADMIN" };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Utilisateur authentifié");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toMatchObject(payload);
  });
});
