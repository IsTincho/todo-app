// routes/userRoutes.js
const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser); // Registro de usuario
router.post("/login", loginUser); // Login de usuario

module.exports = router;
