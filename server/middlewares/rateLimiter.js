const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // Máximo 30 requests por minuto
  message: "Demasiadas solicitudes. Por favor, intenta más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
