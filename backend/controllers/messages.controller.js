// controllers/messages.controller.js
const pool = require("../db");

async function createMessage(req, res) {
  try {
    const {
      id_offre,
      nom,
      email,
      telephone,
      message,
      contenu,
      date_mariage,
      lieu_mariage,
      nb_invites,
      budget,
      budget_estime,
    } = req.body;

    const texteMessage = contenu || message;
    const budgetValue =
      typeof budget_estime !== "undefined"
        ? budget_estime
        : typeof budget !== "undefined"
        ? budget
        : null;

    if (!id_offre || !nom || !email || !texteMessage) {
      return res.status(400).json({
        message: "id_offre, nom, email et message sont obligatoires",
      });
    }

    // récupérer le prestataire de l’offre
    const offreResult = await pool.query(
      "SELECT id_utilisateur AS id_prestataire FROM offres WHERE id_offre = $1",
      [id_offre]
    );

    if (offreResult.rowCount === 0) {
      return res.status(404).json({ message: "Offre introuvable" });
    }

    const id_prestataire = offreResult.rows[0].id_prestataire;

    const insertResult = await pool.query(
      `INSERT INTO messages
        (id_offre,
         id_prestataire,
         nom,
         email,
         telephone,
         contenu,
         date_envoi,
         statut,
         date_mariage,
         lieu_mariage,
         nb_invites,
         budget_estime)
       VALUES
        ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        id_offre,
        id_prestataire,
        nom,
        email,
        telephone || null,
        texteMessage,
        "EN_ATTENTE",
        date_mariage || null,
        lieu_mariage || null,
        nb_invites ? Number(nb_invites) : null,
        budgetValue ? Number(budgetValue) : null,
      ]
    );

    return res.status(201).json({
      message: "Message créé avec succès",
      data: insertResult.rows[0],
    });
  } catch (error) {
    console.error("Erreur createMessage :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la création du message",
    });
  }
}

async function getMessagesForPresta(req, res) {
  try {
    // sécurise selon comment tu remplis req.user dans le middleware
    const id_prestataire =
      req.user.id_utilisateur || req.user.id || req.user.id_user;

    const result = await pool.query(
      `SELECT
          m.*,
          o.titre AS titre_offre
        FROM messages m
        JOIN offres o ON o.id_offre = m.id_offre
        WHERE m.id_prestataire = $1
        ORDER BY m.date_envoi DESC`,
      [id_prestataire]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Erreur getMessagesForPresta :", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des messages" });
  }
}

module.exports = {
  createMessage,
  getMessagesForPresta,
};
