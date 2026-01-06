const express = require("express");
const {
  getAllPresta,
  updateUserStatus,
} = require("../controllers/users.controller");
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

router.put(
  "/:id/actif",
  authenticateToken,
  authorizeRole("ADMIN"),
  updateUserStatus
);

module.exports = router;
