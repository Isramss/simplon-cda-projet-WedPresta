process.env.JWT_SECRET = "test-secret"; // avant require(app)
const { deleteOneOffer } = require("../controllers/offres.controller");

const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

const pool = require("../db");
const app = require("../app");

describe("Offres API", () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  const tokenPresta = jwt.sign(
    { id: 10, role: "PRESTATAIRE" },
    process.env.JWT_SECRET
  );

  const tokenAdmin = jwt.sign(
    { id: 99, role: "ADMIN" },
    process.env.JWT_SECRET
  );

  // ------------------------
  // GET /api/offres
  // ------------------------
  describe("GET /api/offres", () => {
    it("200 + liste", async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id_offre: 1 }] });

      const res = await request(app).get("/api/offres");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("500 si DB error", async () => {
      pool.query.mockRejectedValueOnce(new Error("DB down"));

      const res = await request(app).get("/api/offres");
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("message");
    });
  });

  // ------------------------
  // GET /api/offres/:id
  // ------------------------
  describe("GET /api/offres/:id", () => {
    it("200 + une offre", async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id_offre: 1, titre: "Offre test" }],
      });

      const res = await request(app).get("/api/offres/1");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id_offre", 1);
    });

    it("404 si offre non trouvée", async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get("/api/offres/999");
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/Offre non trouvée/i);
    });

    it("500 si DB error", async () => {
      pool.query.mockRejectedValueOnce(new Error("DB down"));

      const res = await request(app).get("/api/offres/1");
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("message");
    });
  });

  // ------------------------
  // GET /api/offres/mes-offres
  // ------------------------
  describe("GET /api/offres/mes-offres", () => {
    it("200 si authentifié", async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id_offre: 1 }] });

      const res = await request(app)
        .get("/api/offres/Mes-offres")
        .set("Authorization", `Bearer ${tokenPresta}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("500 si DB error", async () => {
      pool.query.mockRejectedValueOnce(new Error("DB down"));

      const res = await request(app)
        .get("/api/offres/Mes-offres")
        .set("Authorization", `Bearer ${tokenPresta}`);

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("message");
    });
  });

  // ------------------------
  // POST /api/offres
  // ------------------------
  describe("POST /api/offres", () => {
    it("400 si titre/description manquants", async () => {
      const res = await request(app)
        .post("/api/offres")
        .set("Authorization", `Bearer ${tokenPresta}`)
        .send({ titre: "Titre sans description" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("201 si création OK", async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id_offre: 1, titre: "Test", description: "Desc" }],
      });

      const res = await request(app)
        .post("/api/offres")
        .set("Authorization", `Bearer ${tokenPresta}`)
        .send({
          titre: "Test",
          description: "Desc",
          prix_min: 100,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("offre");
      expect(res.body.offre).toHaveProperty("id_offre", 1);
    });

    it("500 si insert OK mais rows vide", async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post("/api/offres")
        .set("Authorization", `Bearer ${tokenPresta}`)
        .send({ titre: "Test", description: "Desc" });

      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/aucune donnée/i);
    });

    it("500 si DB error", async () => {
      pool.query.mockRejectedValueOnce(new Error("DB down"));

      const res = await request(app)
        .post("/api/offres")
        .set("Authorization", `Bearer ${tokenPresta}`)
        .send({ titre: "Test", description: "Desc" });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("message");
    });
  });

  // ------------------------
  // PUT /api/offres/:id
  // ------------------------
  describe("PUT /api/offres/:id", () => {
    it("400 si offre non trouvée", async () => {
      // SELECT existing
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .put("/api/offres/1")
        .set("Authorization", `Bearer ${tokenPresta}`)
        .send({ titre: "New" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("400 si pas owner et pas admin", async () => {
      // SELECT existing retourne ownerId différent
      pool.query.mockResolvedValueOnce({
        rows: [{ id_utilisateur: 777 }],
      });

      const res = await request(app)
        .put("/api/offres/1")
        .set("Authorization", `Bearer ${tokenPresta}`) // id=10
        .send({ titre: "New" });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/pas autoriser/i);
    });

    it("200 si admin peut update", async () => {
      // SELECT existing
      pool.query.mockResolvedValueOnce({
        rows: [{ id_utilisateur: 777 }],
      });
      // UPDATE
      pool.query.mockResolvedValueOnce({
        rows: [{ id_offre: 1, titre: "New" }],
      });

      const res = await request(app)
        .put("/api/offres/1")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ titre: "New" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body.offre).toHaveProperty("id_offre", 1);
    });

    it("200 + updateOffer: titre absent -> envoie null (couvre la branche titre || null)", async () => {
      process.env.JWT_SECRET = "test-secret";

      // Token autorisé (ADMIN pour être sûr de passer l'auth/autorisation)
      const token = jwt.sign({ id: 99, role: "ADMIN" }, process.env.JWT_SECRET);

      // 1) L'offre existe (le controller check d'abord)
      pool.query.mockResolvedValueOnce({
        rows: [{ id_utilisateur: 1 }],
      });

      // 2) UPDATE retourne l'offre mise à jour
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id_offre: 1,
            titre: "Titre existant",
            description: "Desc existante",
            statut: "ACTIF",
          },
        ],
      });

      // Body SANS "titre" => titre === undefined => (titre || null) => null
      const res = await request(app)
        .put("/api/offres/1")
        .set("Authorization", `Bearer ${token}`)
        .send({
          // titre absent volontairement
          description: "Nouvelle description",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Offre mise à jour avec succès"
      );

      // Vérifie que l'UPDATE a bien reçu null pour titre (index 1 du tableau params)
      const updateParams = pool.query.mock.calls[1][1];
      expect(updateParams[1]).toBeNull();
    });

    it("500 si DB error", async () => {
      pool.query.mockRejectedValueOnce(new Error("DB down"));

      const res = await request(app)
        .put("/api/offres/1")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ titre: "New" });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("message");
    });
  });

  // ------------------------
  // DELETE /api/offres/:id
  // ------------------------
  describe("DELETE /api/offres/:id", () => {
    it("403 si pas admin", async () => {
      const res = await request(app)
        .delete("/api/offres/1")
        .set("Authorization", `Bearer ${tokenPresta}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message");
    });

    it("403 si utilisateur non ADMIN tente de supprimer une offre", async () => {
      const req = {
        params: { id: 1 },
        user: { id: 10, role: "PRESTATAIRE" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteOneOffer(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Seul l'administrateur peut supprimer une offre",
      });
    });

    it("404 si offre non trouvée", async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .delete("/api/offres/999")
        .set("Authorization", `Bearer ${tokenAdmin}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("200 si suppression OK", async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id_offre: 1 }] });

      const res = await request(app)
        .delete("/api/offres/1")
        .set("Authorization", `Bearer ${tokenAdmin}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/supprimée/i);
    });

    it("500 si DB error", async () => {
      pool.query.mockRejectedValueOnce(new Error("DB down"));

      const res = await request(app)
        .delete("/api/offres/1")
        .set("Authorization", `Bearer ${tokenAdmin}`);

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("message");
    });
  });
});
