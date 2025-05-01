const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/validate-token", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Token válido" });
});

module.exports = router;
