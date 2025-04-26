// Required modules
require('dotenv').config();
const axiosBase = require('axios');
const mongoose = require('mongoose');

// Axios instance with better settings
const axios = axiosBase.create({
  timeout: 30000, // 30 seconds
  headers: {
    'x-apisports-key': process.env.API_KEY,
  }
});

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/kickstats')
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.log("❌ Failed to connect to MongoDB", err));

// Team schema
const teamSchema = new mongoose.Schema({
  name: String,
  league: String,
  country: String,
  players: [{
    name: String,
    position: String,
    nationality: String,
    stats: Object,
  }],
  stats: Object,
  ranking: Number,
});

const Team = mongoose.model('Team', teamSchema);

// API base
const apiUrl = 'https://v3.football.api-sports.io/';

// List of leagues
const leagues = [
  { leagueId: 39, leagueName: 'Premier League' },
  { leagueId: 140, leagueName: 'La Liga' },
  { leagueId: 135, leagueName: 'Serie A' },
  { leagueId: 78, leagueName: 'Bundesliga' },
  { leagueId: 61, leagueName: 'Ligue 1' },
];

// Helper: wait
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper: safe API request with retries
async function safeRequest(config, retries = 5) {
  try {
    return await axios.request(config);
  } catch (error) {
    if (retries > 0) {
      console.warn(`⚠️ Request failed. Retrying in 3 seconds... (${5 - retries + 1})`);
      await wait(3000);
      return safeRequest(config, retries - 1);
    } else {
      throw error;
    }
  }
}

// Fetch and store everything
const fetchAndStoreEverything = async () => {
  try {
    console.log("🧹 Clearing old teams...");
    await Team.deleteMany({});

    for (const league of leagues) {
      console.log(`📥 Fetching teams for ${league.leagueName}...`);

      // Fetch teams
      const teamsResponse = await safeRequest({
        method: 'GET',
        url: `${apiUrl}teams`,
        params: { league: league.leagueId, season: '2023' },
      });

      const teams = teamsResponse.data.response;

      for (let i = 0; i < Math.min(10, teams.length); i++) { // Top 10 teams
        const teamData = teams[i].team;

        console.log(`⚡ Fetching details for ${teamData.name}...`);

        // Fetch players
        const playersResponse = await safeRequest({
          method: 'GET',
          url: `${apiUrl}players`,
          params: { team: teamData.id, season: '2023' },
        });

        const players = playersResponse.data.response.map(player => ({
          name: player.player.name,
          position: player.statistics[0]?.games.position || '',
          nationality: player.player.nationality,
          stats: player.statistics[0] || {},
        }));

        await wait(2000); // 2 second wait to respect rate limit

        // Fetch team stats
        const statsResponse = await safeRequest({
          method: 'GET',
          url: `${apiUrl}teams/statistics`,
          params: { team: teamData.id, league: league.leagueId, season: '2023' },
        });

        const stats = statsResponse.data.response;

        await wait(2000); // 2 second wait again

        // Save team
        const team = new Team({
          name: teamData.name,
          league: league.leagueName,
          country: teamData.country,
          ranking: i + 1,
          players: players,
          stats: stats,
        });

        await team.save();
        console.log(`✅ Saved ${teamData.name} to DB!`);
      }
    }

    console.log("🏁 All teams, players, and stats saved successfully!");
  } catch (error) {
    console.error("❌ Error fetching data:", error.response?.data || error.message);
  }
};

// Run
fetchAndStoreEverything();
