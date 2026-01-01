const express = require("express");
const { getAllPresta } = require("../controllers/users.controller");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/auth.middleware");
const router = express.Router();

router.get(
  "/prestataires",
  authenticateToken,
  authorizeRole("ADMIN"),
  getAllPresta
);

module.exports = router;
