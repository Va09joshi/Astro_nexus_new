const express = require("express");
const router = express.Router();
const { generateBirthChart } = require("../../controllers/birthChartImage.js");

router.post("/generate", generateBirthChart);

module.exports = router;
