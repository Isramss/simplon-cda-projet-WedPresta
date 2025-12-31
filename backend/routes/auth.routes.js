// Ma première route securisé
const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.get("/test", (req, res) => {
  res.json({ message: "Route auth OK" });
});

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Utilisateur authentifié",
    user: req.user,
  });
});

module.exports = router;
