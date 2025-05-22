import React, { useState, useEffect } from 'react';
import { fetchPlayerStats, leagues } from '../fetchData';

function Players() {
  const [selectedLeague, setSelectedLeague] = useState(leagues[0]); // Default to Premier League
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedLeague) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchPlayerStats(selectedLeague.leagueId);
        setPlayerData(data);
      } catch (err) {
        console.error('Error fetching player data:', err);
        setError('Failed to fetch player data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedLeague]);

  return (
    <section className="players-section">
      <div className="section-header">
        <h2>Top Scorers</h2>
      </div>

      <div className="leagues-container">
        {leagues.map(league => (
          <button
            key={league.leagueId}
            className={`league-btn ${selectedLeague?.leagueId === league.leagueId ? 'active' : ''}`}
            onClick={() => setSelectedLeague(league)}
          >
            {league.leagueName}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading">
          Loading player data...
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {playerData && !loading && !error && (
        <div className="players-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Team</th>
                <th>Goals</th>
                <th>Assists</th>
                <th>Matches</th>
              </tr>
            </thead>
            <tbody>
              {playerData.map((player, index) => (
                <tr key={player.player.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="player-cell">
                      <img 
                        src={player.player.photo} 
                        alt={`${player.player.name} photo`} 
                        className="player-photo"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/40?text=No+Photo';
                        }}
                      />
                      <span className="player-name">{player.player.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="team-cell">
                      <img 
                        src={player.statistics[0].team.logo} 
                        alt={`${player.statistics[0].team.name} logo`} 
                        className="team-logo"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/24?text=No+Logo';
                        }}
                      />
                      <span className="team-name">{player.statistics[0].team.name}</span>
                    </div>
                  </td>
                  <td>{player.statistics[0].goals.total || 0}</td>
                  <td>{player.statistics[0].goals.assists || 0}</td>
                  <td>{player.statistics[0].games.appearences || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Players; 