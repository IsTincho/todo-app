const express = require("express");
const { getUserCount } = require("../controllers/adminController");
const router = express.Router();

router.get("/count", getUserCount);

module.exports = router;
