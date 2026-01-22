process.env.JWT_SECRET = "test-secret"; // IMPORTANT: avant require(app)

const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

const app = require("../app");
const pool = require("../db");

describe("GET /api/messages/mes-messages", () => {
  beforeEach(() => {
    pool.query.mockReset();
    process.env.JWT_SECRET = "test-secret";
  });

  it("401 si aucun token", async () => {
    const res = await request(app).get("/api/messages/mes-messages");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("403 si token invalide", async () => {
    const res = await request(app)
      .get("/api/messages/mes-messages")
      .set("Authorization", "Bearer token-invalide");

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
  });

  it("403 si rôle insuffisant (ex: VISITEUR)", async () => {
    const token = jwt.sign(
      { id_utilisateur: 1, role: "VISITEUR" },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .get("/api/messages/mes-messages")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
  });

  it("200 + liste des messages si PRESTATAIRE", async () => {
    const token = jwt.sign(
      { id_utilisateur: 1, role: "PRESTATAIRE" },
      process.env.JWT_SECRET
    );

    const fakeRows = [
      {
        id_message: 1,
        id_offre: 10,
        id_prestataire: 1,
        contenu: "Bonjour",
        titre_offre: "Photographe mariage",
      },
    ];

    pool.query.mockResolvedValueOnce({ rows: fakeRows });

    const res = await request(app)
      .get("/api/messages/mes-messages")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("titre_offre");

    expect(pool.query).toHaveBeenCalled();
    expect(pool.query.mock.calls[0][1]).toEqual([1]);
  });

  it("200 + liste des messages si ADMIN", async () => {
    const token = jwt.sign(
      { id_utilisateur: 99, role: "ADMIN" },
      process.env.JWT_SECRET
    );

    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .get("/api/messages/mes-messages")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("500 si erreur DB", async () => {
    const token = jwt.sign(
      { id_utilisateur: 1, role: "PRESTATAIRE" },
      process.env.JWT_SECRET
    );

    pool.query.mockRejectedValueOnce(new Error("DB down"));

    const res = await request(app)
      .get("/api/messages/mes-messages")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
  });
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });
});
