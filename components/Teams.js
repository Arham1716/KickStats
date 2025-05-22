import React, { useState, useEffect } from 'react';
import { fetchLeagueTeams, leagues } from '../fetchData';

function Teams() {
  const [selectedLeague, setSelectedLeague] = useState(leagues[0]); // Default to Premier League
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedLeague) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchLeagueTeams(selectedLeague.leagueId);
        setTeamData(data);
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError('Failed to fetch team data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedLeague]);

  return (
    <section className="teams-section">
      <div className="section-header">
        <h2>Teams</h2>
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
          Loading team data...
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {teamData && !loading && !error && (
        <div className="teams-grid">
          {teamData.map((team) => (
            <div key={team.team.id} className="team-card">
              <div className="team-logo-container">
                <img 
                  src={team.team.logo} 
                  alt={`${team.team.name} logo`} 
                  className="team-logo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100?text=No+Logo';
                  }}
                />
              </div>
              <div className="team-info">
                <h3 className="team-name">{team.team.name}</h3>
                <p className="team-country">{team.team.country}</p>
                <div className="team-stats">
                  <div className="stat">
                    <span className="stat-label">Founded</span>
                    <span className="stat-value">{team.team.founded || 'N/A'}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Venue</span>
                    <span className="stat-value">{team.venue.name || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Teams; 