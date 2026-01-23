process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.BCRYPT_SALT_ROUNDS = "10";

const request = require("supertest");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const pool = require("../db");
const bcrypt = require("bcrypt");
const app = require("../app");

describe("AUTH – register & login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/auth/register → 400 si champs manquants", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
    });

    expect(res.status).toBe(400);
  });

  it("POST /api/auth/register → 400 si email déjà existant", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id_utilisateur: 1 }],
    });

    const res = await request(app).post("/api/auth/register").send({
      nom: "Test",
      email: "test@test.com",
      motDePasse: "password",
    });

    expect(res.status).toBe(400);
  });

  it("POST /api/auth/register → 201 si OK", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] }) // email non existant
      .mockResolvedValueOnce({ rows: [{ id_role: 2 }] }) // role PRESTATAIRE
      .mockResolvedValueOnce({
        rows: [
          {
            id_utilisateur: 1,
            nom: "Test",
            email: "test@test.com",
            id_role: 2,
          },
        ],
      }); // insert user

    bcrypt.hash.mockResolvedValue("hashed-password");

    const res = await request(app).post("/api/auth/register").send({
      nom: "Test",
      email: "test@test.com",
      motDePasse: "password",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("POST /api/auth/login → 400 si email invalide", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "invalid-email",
      motDePasse: "password",
    });

    expect(res.status).toBe(400);
  });

  it("POST /api/auth/login → 400 si identifiants invalides", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      motDePasse: "password",
    });

    expect(res.status).toBe(400);
  });

  it("POST /api/auth/login → 200 si OK", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          id_utilisateur: 1,
          nom: "Test",
          email: "test@test.com",
          mot_de_passe: "hashed",
          actif: true,
          code_role: "PRESTATAIRE",
        },
      ],
    });

    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      motDePasse: "password",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
