const pool = require("../db");

async function getAllAdresses(req, res) {
  try {
    const result = await pool.query(
      `SELECT 
         id_adresse,
         ville,
         code_postal
       FROM adresses
       ORDER BY ville ASC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Erreur getAllAdresses :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des adresses",
    });
  }
}

module.exports = {
  getAllAdresses,
};
