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
        o.statut,
        o.image_url,
        c.libelle_categorie,
        u.nom AS prestatire_nom
    FROM offres o
    LEFT JOIN categories c ON o.id_categorie = c.id_categorie
    LEFT JOIN utilisateurs u ON o.id_utilisateur = u.id_utilisateur
    ORDER BY o.date_creation DESC`
    );
    return res.json(result.rows);
  } catch (error) {
    console.error("Erreur getAllOffres :", error);

    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la récuperation des offres" });
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

module.exports = { getAllOffers, getOneOfferById, getMyOffers, createOffer };
