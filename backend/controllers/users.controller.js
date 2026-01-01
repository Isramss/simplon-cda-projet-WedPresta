const pool = require("../db");

async function getAllPresta(req, res) {
  try {
    const result = await pool.query(
      `SELECT 
      u.id_utilisateur,
      u.nom,
      u.email,
      u.telephone,
      u.date_creation_compte,
      u.actif,
      u.avatar_url,
      r.libelle_role,
      r.code_role
   FROM utilisateurs u
   INNER JOIN roles r 
     ON u.id_role = r.id_role
   WHERE r.code_role = 'PRESTATAIRE'
   ORDER BY u.date_creation_compte DESC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Erreur getAllPresta:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des prestatires",
    });
  }
}

module.exports = {
  getAllPresta,
};
