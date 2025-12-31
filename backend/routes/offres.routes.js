const express = require("express");
const {
  getAllOffers,
  getOneOfferById,
  getMyOffers,
  createOffer,
} = require("../controllers/offres.controller");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", getAllOffers);
router.get(`/:id`, getOneOfferById);
router.get(
  "/Mes-offres",
  authenticateToken,
  authorizeRole("PRESTATAIRE", "ADMIN"),
  getMyOffers
);
router.post(
  "/",
  authenticateToken,
  authorizeRole("PRESTATAIRE", "ADMIN"),
  createOffer
);

module.exports = router;
