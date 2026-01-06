const express = require("express");
const router = express.Router();

const { getAllAdresses } = require("../controllers/adresses.controller");

router.get("/", getAllAdresses);

module.exports = router;
