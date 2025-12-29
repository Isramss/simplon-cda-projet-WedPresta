// Ma première route securisé
const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Route auth OK" });
});

router.post("/register", register);

router.post("/login", login);

module.exports = router;
