const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Erreur vérification token :", err);
      return res.status(403).json({ message: "Token invalide ou expiré" });
    }
    req.user = user;
    next();
  });
}

function authorizeRole(...rolesAutorises) {
  return (req, res, next) => {
    if (!req.user || !rolesAutorises.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Accès refusé (rôle insuffisant)" });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole,
};
