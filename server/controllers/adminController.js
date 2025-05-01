const User = require("../models/User");

// Contar usuarios (Es un TEST)
const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error("Error al contar los usuarios:", err.message);
    res.status(500).json({ message: "Error al contar los usuarios" });
  }
};

module.exports = { getUserCount };
