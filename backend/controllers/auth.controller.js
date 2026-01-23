const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const SALT_ROUNDS = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

//Inscription
async function register(req, res) {
  console.log("register - body reçu:", req.body);

  try {
    const { nom, email, motDePasse, telephone } = req.body;

    //verif des champs obligatoires
    if (!nom || !email || !motDePasse) {
      return res
        .status(400)
        .json({ message: "Nom, email et mot de passe sont obligatoires" });
    }
    // verif du mail
    const existing = await pool.query(
      "SELECT id_utilisateur FROM utilisateurs WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Un utilisateur existe déjà avec cet email" });
    }
    // 3) Récupérer l'id_role du PRESTATAIRE
    const roleResult = await pool.query(
      "SELECT id_role FROM roles WHERE code_role = $1",
      ["PRESTATAIRE"]
    );
    if (roleResult.rows.length === 0) {
      return res
        .status(500)
        .json({ message: "Rôle PRESTATAIRE introuvable en base" });
    }
    const idRole = roleResult.rows[0].id_role;

    // Hasher le mot de passe
    const hash = await bcrypt.hash(motDePasse, SALT_ROUNDS);

    // Insérer l'utilisateur en base
    const insert = await pool.query(
      `INSERT INTO utilisateurs (nom, email, mot_de_passe, telephone, id_role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_utilisateur, nom, email, id_role`,
      [nom, email, hash, telephone || null, idRole]
    );

    const user = insert.rows[0];

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id_utilisateur, role: "PRESTATAIRE" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    // Réponse au client
    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: user.id_utilisateur,
        nom: user.nom,
        email: user.email,
        role: "PRESTATAIRE",
      },
      token,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l’utilisateur:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la création de l’utilisateur" });
  }
}

// Connexion

async function login(req, res) {
  console.log("login - body reçu :", req.body);

  try {
    const { email, motDePasse } = req.body;

    // Vérif des champs obligatoires
    if (!email || !motDePasse) {
      return res
        .status(400)
        .json({ message: "Email et mot de passe obligatoires" });
    }

    // Vérif du format d'email + regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format d'email invalide" });
    }

    // Je récupération de l'utilisateur en BDD
    const result = await pool.query(
      `SELECT 
          u.id_utilisateur,
          u.nom,
          u.email,
          u.mot_de_passe,
          u.actif,
          r.code_role
        FROM utilisateurs u
        JOIN roles r ON u.id_role = r.id_role
        WHERE u.email = $1`,
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const user = result.rows[0];

    // Vérif du mot de passe
    const isValidPassword = await bcrypt.compare(motDePasse, user.mot_de_passe);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    // Vérif du statut actif
    if (!user.actif) {
      return res.status(403).json({
        message: "Votre compte est désactivé par l'administrateur",
      });
    }

    //Génération du token JWT
    const token = jwt.sign(
      {
        id: user.id_utilisateur,
        role: user.code_role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    //Réponse OK
    return res.json({
      message: "Connexion réussie",
      user: {
        id: user.id_utilisateur,
        nom: user.nom,
        email: user.email,
        role: user.code_role,
        actif: user.actif,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur dans login :", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la connexion" });
  }
}

module.exports = {
  register,
  login,
};
