// routes/adminRoutes.js
const express = require("express");
const { getUserCount } = require("../controllers/adminController");
const router = express.Router();

router.get("/count", getUserCount); // Obtener el conteo de usuarios

module.exports = router;
