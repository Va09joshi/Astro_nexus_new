const express = require('express');
const router = express.Router();
const { getRandomCards } = require('../../controllers/services/tarotController.js');

// GET /api/tarot/random?n=3
router.get('/random', getRandomCards);

module.exports = router;
