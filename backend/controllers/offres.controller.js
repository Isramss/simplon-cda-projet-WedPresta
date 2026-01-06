const pool = require("../db");

// Voir toutes les offres :
async function getAllOffers(req, res) {
  try {
    const result = await pool.query(
      `SELECT 
         o.id_offre,
         o.titre,
         o.description,
         o.prix_min,
         o.zone_intervention,
         o.date_creation,
         o.date_maj,
         o.statut,
         o.image_url,
         u.id_utilisateur,
         u.nom AS prestataire_nom,
         u.email AS prestataire_email
       FROM offres o
       LEFT JOIN utilisateurs u 
         ON o.id_utilisateur = u.id_utilisateur
       ORDER BY o.id_offre`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Erreur getAllOffers:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des offres" });
  }
}

// une seule offre

async function getOneOfferById(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        o.id_offre,
        o.titre,
        o.description,
        o.prix_min,
        o.zone_intervention,
        o.date_creation,
        o.date_maj,
        o.statut,
        o.image_url,
        c.libelle_categorie,
        u.nom AS prestataire_nom
     FROM offres o
     LEFT JOIN categories c ON o.id_categorie = c.id_categorie
     LEFT JOIN utilisateurs u ON o.id_utilisateur = u.id_utilisateur
     WHERE o.id_offre = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur getOffreById:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération de l'offre" });
  }
}

// Les offres qui concernent un seul presta (visible que par lui-même)
async function getMyOffers(req, res) {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT 
            id_offre,
            titre,
            description,
            prix_min,
            zone_intervention,
            date_creation,
            date_maj,
            statut,
            image_url
            FROM offres
            WHERE id_utilisateur = $1
            ORDER BY date_creation DESC`,
      [userId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Erreur getMesOffres:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération de vos offres",
    });
  }
}

//Creation d'une offre
async function createOffer(req, res) {
  const userId = req.user.id;
  const {
    titre,
    description,
    prix_min,
    zone_intervention,
    id_categorie,
    image_url,
  } = req.body;

  try {
    if (!titre || !description) {
      return res
        .status(400)
        .json({ message: "Titre et description sont obligatoire" });
    }
    const result = await pool.query(
      `INSERT INTO offres ( titre, 
            description, 
            prix_min, 
            zone_intervention, 
            date_creation, 
            date_maj,
            statut,
            image_url,
            id_categorie,
            id_utilisateur
         ) VALUES (
            $1, $2, $3, $4, NOW(), NOW(), $5, $6, $7, $8
         )
         RETURNING *`,
      [
        titre,
        description,
        prix_min || null,
        zone_intervention || null,
        "ACTIF",
        image_url || null,
        id_categorie || null,
        userId,
      ]
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(500).json({
        message: "L'offre a été insérée mais aucune donnée n'a été retournée",
      });
    }

    return res.status(201).json({
      message: "Offre créée avec succès",
      offre: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur createOffer:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la création de l'offre" });
  }
}

async function updateOffer(req, res) {
  const { id } = req.params;

  const {
    titre,
    description,
    prix_min,
    zone_intervention,
    statut,
    id_categorie,
    image_url,
  } = req.body;

  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // je verifie d'abord si l'offre existe et si la personne peut la modifier (id + rôle)
    const existing = await pool.query(
      "SELECT id_utilisateur FROM offres WHERE id_offre = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(400).json({ message: "Offre non trouvée" });
    }

    const ownerId = existing.rows[0].id_utilisateur;

    if (userRole !== "ADMIN" && ownerId !== userId) {
      return res
        .status(400)
        .json({ message: " Vous n'etes pas autoriser à modifier cette offre" });
    }

    // l'update de l'offre

    const result = await pool.query(
      `UPDATE offres
      SET 
        titre = COALESCE($2, titre),
        description = COALESCE($3, description),
        prix_min = COALESCE($4, prix_min),
        zone_intervention = COALESCE($5, zone_intervention),
        statut = COALESCE($6, statut),
        image_url = COALESCE($7, image_url),
        id_categorie = COALESCE($8, id_categorie),
        date_maj = NOW()
      WHERE id_offre = $1
      RETURNING *`,
      [
        id,
        titre || null,
        description || null,
        prix_min || null,
        zone_intervention || null,
        statut || null,
        image_url || null,
        id_categorie || null,
      ]
    );
    return res.json({
      message: "Offre mise à jour avec succès",
      offre: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur updateOffre:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour de l'offre" });
  }
}

async function deleteOneOffer(req, res) {
  const { id } = req.params;
  const userRole = req.user.role;

  try {
    // Seulement l'admin peut effacer une offre
    if (userRole !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Seul l'administrateur peut supprimer une offre" });
    }

    //
    const result = await pool.query(
      "DELETE FROM offres WHERE id_offre =$1 RETURNING id_offre",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    return res.json({ message: "Offre supprimée avec succès" });
  } catch (error) {
    console.error("Erreur deletOneOffer", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression de l'offre" });
  }
}

module.exports = {
  getAllOffers,
  getOneOfferById,
  getMyOffers,
  createOffer,
  updateOffer,
  deleteOneOffer,
};
