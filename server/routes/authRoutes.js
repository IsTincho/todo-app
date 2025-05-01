// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", registerUser); // Registro de usuario
router.post("/login", loginUser); // Login de usuario

// NUEVA RUTA: validación del token
router.get("/validate-token", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Token válido" });
});

module.exports = router;
