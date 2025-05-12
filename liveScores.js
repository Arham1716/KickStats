// routes/liveScores.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Create Axios instance
const api = axios.create({
  baseURL: 'https://v3.football.api-sports.io/',
  timeout: 15000,
  headers: {
    'x-apisports-key': process.env.API_KEY,
  },
});

// GET /api/live-scores
router.get('/live-scores', async (req, res) => {
  try {
    const response = await api.get('fixtures', { params: { live: 'all' } });
    const liveFixtures = response.data.response;

    res.json(liveFixtures);
  } catch (error) {
    console.error('❌ Error fetching live scores:', error.message);
    res.status(500).json({ error: 'Failed to fetch live scores' });
  }
});

module.exports = router;
