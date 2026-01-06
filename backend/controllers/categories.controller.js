const pool = require("../db");

async function getAllCategories(req, res) {
  try {
    const result = await pool.query(
      `SELECT id_categorie, libelle_categorie 
       FROM categories
       ORDER BY libelle_categorie`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Erreur getAllCategories:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des catégories",
    });
  }
}

module.exports = {
  getAllCategories,
};
