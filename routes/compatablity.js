const express = require("express");
const router = express.Router();

const {
  ashtakootScore,
} = require("../controllers/compatabiltycontroller");

// POST /api/v1/compatibility/match-making/ashtakoot-score
router.post(
  "/match-making/ashtakoot-score",
  ashtakootScore
);

module.exports = router;
