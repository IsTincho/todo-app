const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const verifyApiCredentials = require("./middlewares/verifyApiCredentials");
const apiLimiter = require("./middlewares/rateLimiter");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(apiLimiter);
app.use(verifyApiCredentials);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Conectar DB y lanzar servidor
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
