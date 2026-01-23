const request = require("supertest");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

const pool = require("../db");
const app = require("../app");

describe("POST /api/messages/devis", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("400 si champs obligatoires manquants", async () => {
    const res = await request(app).post("/api/messages/devis").send({
      // id_offre manquant
      nom: "Test",
      email: "test@test.com",
      message: "Bonjour",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("404 si offre introuvable", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    const res = await request(app).post("/api/messages/devis").send({
      id_offre: 9999,
      nom: "Test",
      email: "test@test.com",
      message: "Bonjour",
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Offre introuvable");

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query.mock.calls[0][0]).toMatch(/SELECT id_utilisateur/i);
  });

  test("201 si création OK (SELECT puis INSERT)", async () => {
    // 1) SELECT prestataire
    pool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id_prestataire: 12 }],
    });

    // 2) INSERT message
    pool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          id_message: 1,
          id_offre: 10,
          id_prestataire: 12,
          nom: "Test",
          email: "test@test.com",
          telephone: null,
          contenu: "Bonjour",
          statut: "EN_ATTENTE",
        },
      ],
    });

    const res = await request(app).post("/api/messages/devis").send({
      id_offre: 10,
      nom: "Test",
      email: "test@test.com",
      message: "Bonjour",
      nb_invites: "50",
      budget: "1000",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Message créé avec succès");
    expect(res.body.data).toHaveProperty("id_prestataire", 12);

    expect(pool.query).toHaveBeenCalledTimes(2);

    // vérifier que l'INSERT reçoit bien les valeurs converties
    const insertParams = pool.query.mock.calls[1][1];
    expect(insertParams[0]).toBe(10); // id_offre
    expect(insertParams[1]).toBe(12); // id_prestataire
    expect(insertParams[5]).toBe("Bonjour"); // contenu
    expect(insertParams[9]).toBe(50); // nb_invites Number("50")
    expect(insertParams[10]).toBe(1000); // budget Number("1000")
  });

  test("201 si 'contenu' est fourni (prioritaire sur 'message')", async () => {
    pool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id_prestataire: 77 }],
    });

    pool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id_message: 2, id_offre: 10, id_prestataire: 77 }],
    });

    const res = await request(app).post("/api/messages/devis").send({
      id_offre: 10,
      nom: "Test",
      email: "test@test.com",
      message: "Message IGNORÉ",
      contenu: "Contenu PRIORITAIRE",
    });

    expect(res.status).toBe(201);
    const insertParams = pool.query.mock.calls[1][1];
    expect(insertParams[5]).toBe("Contenu PRIORITAIRE");
  });

  test("500 si erreur DB (catch)", async () => {
    pool.query.mockRejectedValueOnce(new Error("DB down"));

    const res = await request(app).post("/api/messages/devis").send({
      id_offre: 10,
      nom: "Test",
      email: "test@test.com",
      message: "Bonjour",
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      "message",
      "Erreur serveur lors de la création du message"
    );
  });
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });
});
