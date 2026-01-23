process.env.JWT_SECRET = "test-secret";

const request = require("supertest");

jest.mock("../db", () => ({
  query: jest.fn(),
}));
const pool = require("../db");

// Mock bcrypt + jwt (sinon comportement réel => tests instables)
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
const bcrypt = require("bcrypt");

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));
const jwt = require("jsonwebtoken");

const app = require("../app");

describe("AUTH – register & login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("400 si champs obligatoires manquants", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@test.com",
        // nom + motDePasse manquants
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(pool.query).not.toHaveBeenCalled();
    });

    it("400 si email déjà existant", async () => {
      // 1) SELECT existing user => existe
      pool.query.mockResolvedValueOnce({
        rows: [{ id_utilisateur: 1 }],
      });

      const res = await request(app).post("/api/auth/register").send({
        nom: "Test",
        email: "test@test.com",
        motDePasse: "password",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/existe déjà/i);

      // register doit s'arrêter après la 1ère query
      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it("201 si OK", async () => {
      // 1) SELECT existing => vide
      pool.query.mockResolvedValueOnce({ rows: [] });

      // 2) SELECT role PRESTATAIRE => trouvé
      pool.query.mockResolvedValueOnce({ rows: [{ id_role: 2 }] });

      // bcrypt.hash
      bcrypt.hash.mockResolvedValueOnce("hashed-password");

      // 3) INSERT utilisateur => retourne l'user
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id_utilisateur: 5,
            nom: "Test",
            email: "test@test.com",
            id_role: 2,
          },
        ],
      });

      // jwt.sign
      jwt.sign.mockReturnValueOnce("token-123");

      const res = await request(app).post("/api/auth/register").send({
        nom: "Test",
        email: "test@test.com",
        motDePasse: "password",
        telephone: "0600000000",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/créé/i);
      expect(res.body).toHaveProperty("token", "token-123");
      expect(res.body.user).toHaveProperty("email", "test@test.com");

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/auth/login", () => {
    it("400 si email invalide", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "invalid-email",
        motDePasse: "password",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/format/i);
      expect(pool.query).not.toHaveBeenCalled();
    });

    it("400 si identifiants invalides (email inconnu)", async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).post("/api/auth/login").send({
        email: "test@test.com",
        motDePasse: "password",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/invalides/i);
    });

    it("200 si OK", async () => {
      // 1) SELECT user
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id_utilisateur: 1,
            nom: "Test",
            email: "test@test.com",
            mot_de_passe: "hashed-password",
            actif: true, // IMPORTANT sinon 403
            code_role: "PRESTATAIRE",
          },
        ],
      });

      // 2) bcrypt.compare => true
      bcrypt.compare.mockResolvedValueOnce(true);

      // 3) jwt.sign
      jwt.sign.mockReturnValueOnce("token-abc");

      const res = await request(app).post("/api/auth/login").send({
        email: "test@test.com",
        motDePasse: "password",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/réussie/i);
      expect(res.body).toHaveProperty("token", "token-abc");
      expect(res.body.user).toHaveProperty("role", "PRESTATAIRE");
    });
  });
});
