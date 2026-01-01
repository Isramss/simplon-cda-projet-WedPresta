const express = require("express");
const {
  getAllOffers,
  getOneOfferById,
  getMyOffers,
  createOffer,
  updateOffer,
  deleteOneOffer,
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

router.put(
  `/:id`,
  authenticateToken,
  authorizeRole("PRESTATAIRE", "ADMIN"),
  updateOffer
);

router.delete(
  `/:id`,
  authenticateToken,
  authorizeRole("ADMIN"),
  deleteOneOffer
);

module.exports = router;
