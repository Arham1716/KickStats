import React, { useState, useEffect } from 'react';
import { fetchLeagueStandings, leagues } from '../fetchData';

function Statistics() {
  const [selectedLeague, setSelectedLeague] = useState(leagues[0]); // Default to Premier League
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedLeague) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchLeagueStandings(selectedLeague.leagueId);
        setStatsData(data);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to fetch statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedLeague]);

  const calculateLeagueStats = (data) => {
    if (!data) return null;

    const stats = {
      totalGoals: 0,
      totalMatches: 0,
      avgGoalsPerMatch: 0,
      mostGoalsFor: { team: '', goals: 0 },
      mostGoalsAgainst: { team: '', goals: 0 },
      bestDefense: { team: '', goals: 0 },
      bestAttack: { team: '', goals: 0 },
      totalWins: 0,
      totalDraws: 0,
      totalLosses: 0
    };

    data.forEach(team => {
      // Total goals
      stats.totalGoals += team.all.goals.for;
      stats.totalMatches += team.all.played;
      stats.totalWins += team.all.win;
      stats.totalDraws += team.all.draw;
      stats.totalLosses += team.all.lose;

      // Most goals for
      if (team.all.goals.for > stats.mostGoalsFor.goals) {
        stats.mostGoalsFor = {
          team: team.team.name,
          goals: team.all.goals.for
        };
      }

      // Most goals against
      if (team.all.goals.against > stats.mostGoalsAgainst.goals) {
        stats.mostGoalsAgainst = {
          team: team.team.name,
          goals: team.all.goals.against
        };
      }

      // Best defense
      if (stats.bestDefense.goals === 0 || team.all.goals.against < stats.bestDefense.goals) {
        stats.bestDefense = {
          team: team.team.name,
          goals: team.all.goals.against
        };
      }

      // Best attack
      if (team.all.goals.for > stats.bestAttack.goals) {
        stats.bestAttack = {
          team: team.team.name,
          goals: team.all.goals.for
        };
      }
    });

    // Calculate average goals per match
    stats.avgGoalsPerMatch = (stats.totalGoals / stats.totalMatches).toFixed(2);

    return stats;
  };

  const leagueStats = calculateLeagueStats(statsData);

  return (
    <section className="statistics-section">
      <div className="section-header">
        <h2>League Statistics</h2>
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
          Loading statistics...
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {leagueStats && !loading && !error && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Goals</h3>
            <div className="stat-value">{leagueStats.totalGoals}</div>
            <div className="stat-label">Total Goals</div>
          </div>

          <div className="stat-card">
            <h3>Matches</h3>
            <div className="stat-value">{leagueStats.totalMatches}</div>
            <div className="stat-label">Total Matches</div>
          </div>

          <div className="stat-card">
            <h3>Average</h3>
            <div className="stat-value">{leagueStats.avgGoalsPerMatch}</div>
            <div className="stat-label">Goals per Match</div>
          </div>

          <div className="stat-card">
            <h3>Best Attack</h3>
            <div className="stat-value">{leagueStats.bestAttack.goals}</div>
            <div className="stat-label">{leagueStats.bestAttack.team}</div>
          </div>

          <div className="stat-card">
            <h3>Best Defense</h3>
            <div className="stat-value">{leagueStats.bestDefense.goals}</div>
            <div className="stat-label">{leagueStats.bestDefense.team}</div>
          </div>

          <div className="stat-card">
            <h3>Results</h3>
            <div className="stat-value">
              W: {leagueStats.totalWins} | D: {leagueStats.totalDraws} | L: {leagueStats.totalLosses}
            </div>
            <div className="stat-label">Total Results</div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Statistics; 