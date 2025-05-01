const verifyApiCredentials = (req, res, next) => {
  const client = req.headers["x-api-client"];
  const secret = req.headers["x-api-secret"];

  if (client !== process.env.API_CLIENT || secret !== process.env.API_SECRET) {
    return res.status(403).json({ message: "Credenciales de API inválidas" });
  }

  next();
};

module.exports = verifyApiCredentials;
