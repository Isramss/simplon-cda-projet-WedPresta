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

async function updateUserStatus(req, res) {
  const { id } = req.params;
  const { actif } = req.body; // true ou false

  try {
    const result = await pool.query(
      `UPDATE utilisateurs
       SET actif = $1
       WHERE id_utilisateur = $2
       RETURNING id_utilisateur, nom, email, actif`,
      [actif, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json({
      message: "Statut utilisateur mis à jour",
      utilisateur: result.rows[0],
    });
  } catch (err) {
    console.error("Erreur updateUserStatus:", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour du statut" });
  }
}

module.exports = {
  getAllPresta,
  updateUserStatus,
};
