const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 30, // max 30 reqs por minuto
  message: "Demasiadas solicitudes. Por favor, intenta más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
