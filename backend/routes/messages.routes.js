// routes/messages.routes.js
const express = require("express");
const {
  createMessage,
  getMessagesForPresta,
} = require("../controllers/messages.controller");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/auth.middleware");

const router = express.Router();

// création d’un message / devis
router.post("/devis", createMessage);

// messages reçus par un prestataire
router.get(
  "/mes-messages",
  authenticateToken,
  authorizeRole("PRESTATAIRE", "ADMIN"),
  getMessagesForPresta
);

module.exports = router;
