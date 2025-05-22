// API configuration
const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = 'https://v3.football.api-sports.io';

console.log('API Key available:', !!API_KEY); // Check if API key is available

// List of leagues
export const leagues = [
  { leagueId: 39, leagueName: 'Premier League' },
  { leagueId: 140, leagueName: 'La Liga' },
  { leagueId: 135, leagueName: 'Serie A' },
  { leagueId: 78, leagueName: 'Bundesliga' },
  { leagueId: 61, leagueName: 'Ligue 1' },
];

// Fetch league standings from API
export const fetchLeagueStandings = async (leagueId) => {
  try {
    console.log('Fetching standings for league:', leagueId);
    
    if (!API_KEY) {
      throw new Error('API key is not configured');
    }

    const response = await fetch(`${API_URL}/standings?league=${leagueId}&season=2023`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': API_KEY
      }
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('API response data:', data);

    if (!data.response || !data.response[0] || !data.response[0].league) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid API response format');
    }

    const standings = data.response[0].league.standings[0];
    console.log('Processed standings:', standings);
    return standings;
  } catch (error) {
    console.error(`Error fetching standings for league ${leagueId}:`, error);
    throw error;
  }
};

// Fetch league teams from API
export const fetchLeagueTeams = async (leagueId) => {
  try {
    console.log('Fetching teams for league:', leagueId);
    
    if (!API_KEY) {
      throw new Error('API key is not configured');
    }

    const response = await fetch(`${API_URL}/teams?league=${leagueId}&season=2023`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': API_KEY
      }
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('API response data:', data);

    if (!data.response) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid API response format');
    }

    return data.response;
  } catch (error) {
    console.error(`Error fetching teams for league ${leagueId}:`, error);
    throw error;
  }
};

// Fetch team statistics from API
export const fetchTeamStats = async (teamId, leagueId) => {
  try {
    console.log('Fetching stats for team:', teamId);
    
    if (!API_KEY) {
      throw new Error('API key is not configured');
    }

    const response = await fetch(`${API_URL}/teams/statistics?team=${teamId}&league=${leagueId}&season=2023`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': API_KEY
      }
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('API response data:', data);

    if (!data.response) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid API response format');
    }

    return data.response;
  } catch (error) {
    console.error(`Error fetching stats for team ${teamId}:`, error);
    throw error;
  }
};

// Fetch player statistics from API
export const fetchPlayerStats = async (leagueId) => {
  try {
    console.log('Fetching player stats for league:', leagueId);
    
    if (!API_KEY) {
      throw new Error('API key is not configured');
    }

    const response = await fetch(`${API_URL}/players/topscorers?league=${leagueId}&season=2023`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': API_KEY
      }
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('API response data:', data);

    if (!data.response) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid API response format');
    }

    return data.response;
  } catch (error) {
    console.error(`Error fetching player stats for league ${leagueId}:`, error);
    throw error;
  }
};

// Fetch matches from API
export const fetchMatches = async (leagueId) => {
  try {
    console.log('Fetching matches for league:', leagueId);
    console.log('API Key available:', !!API_KEY);
    
    if (!API_KEY) {
      throw new Error('API key is not configured');
    }

    // Get current date and format it for the API
    const today = new Date();
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    // Fetch matches for today and next 7 days
    const response = await fetch(
      `${API_URL}/fixtures?league=${leagueId}&season=2023&date=${formatDate(today)}&timezone=UTC`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': API_KEY
        }
      }
    );

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Full API response data:', JSON.stringify(data, null, 2));

    if (!data.response) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid API response format');
    }

    // Sort matches by date
    const matches = data.response.sort((a, b) => {
      return new Date(a.fixture.date) - new Date(b.fixture.date);
    });

    console.log('Sorted matches:', JSON.stringify(matches, null, 2));
    return matches;
  } catch (error) {
    console.error(`Error fetching matches for league ${leagueId}:`, error);
    throw error;
  }
};

// Fetch news from API
export const fetchNews = async () => {
  try {
    console.log('Fetching news...');
    
    if (!API_KEY) {
      throw new Error('API key is not configured');
    }

    // Since news endpoint is not available in free plan, return mock data
    return [
      {
        id: 1,
        title: "Premier League Title Race Heats Up",
        description: "Manchester City and Arsenal continue their battle for the Premier League title as the season enters its final stages.",
        image: "https://media.api-sports.io/football/teams/50.png",
        date: "2024-03-15",
        link: "#"
      },
      {
        id: 2,
        title: "Champions League Quarter-Finals Draw",
        description: "The draw for the Champions League quarter-finals has been made, setting up some exciting matchups for the next round.",
        image: "https://media.api-sports.io/football/teams/541.png",
        date: "2024-03-14",
        link: "#"
      },
      {
        id: 3,
        title: "New Stadium Plans Announced",
        description: "A Premier League club has announced plans for a state-of-the-art new stadium that will increase capacity and improve facilities.",
        image: "https://media.api-sports.io/football/teams/42.png",
        date: "2024-03-13",
        link: "#"
      }
    ];

  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// Fetch transfers from API
export const fetchTransfers = async () => {
  try {
    console.log('Fetching transfers...');
    
    if (!API_KEY) {
      throw new Error('API key is not configured');
    }

    // Since transfers endpoint is not available in free plan, return mock data
    return [
      {
        id: 1,
        player: {
          name: "Jude Bellingham",
          photo: "https://media.api-sports.io/football/players/891.png"
        },
        from: {
          team: {
            name: "Borussia Dortmund",
            logo: "https://media.api-sports.io/football/teams/165.png"
          }
        },
        to: {
          team: {
            name: "Real Madrid",
            logo: "https://media.api-sports.io/football/teams/541.png"
          }
        },
        type: "Permanent",
        date: "2023-06-14"
      },
      {
        id: 2,
        player: {
          name: "Declan Rice",
          photo: "https://media.api-sports.io/football/players/901.png"
        },
        from: {
          team: {
            name: "West Ham",
            logo: "https://media.api-sports.io/football/teams/48.png"
          }
        },
        to: {
          team: {
            name: "Arsenal",
            logo: "https://media.api-sports.io/football/teams/42.png"
          }
        },
        type: "Permanent",
        date: "2023-07-15"
      },
      {
        id: 3,
        player: {
          name: "Moises Caicedo",
          photo: "https://media.api-sports.io/football/players/276.png"
        },
        from: {
          team: {
            name: "Brighton",
            logo: "https://media.api-sports.io/football/teams/51.png"
          }
        },
        to: {
          team: {
            name: "Chelsea",
            logo: "https://media.api-sports.io/football/teams/49.png"
          }
        },
        type: "Permanent",
        date: "2023-08-14"
      }
    ];

  } catch (error) {
    console.error('Error fetching transfers:', error);
    throw error;
  }
};