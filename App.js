import React, { useState, useEffect } from 'react';
import './App.css';
import { leagues, fetchLeagueStandings, fetchLeagueTeams, fetchMatches, fetchNews, fetchTransfers } from './fetchData';
import Players from './components/Players';
import Teams from './components/Teams';
import Statistics from './components/Statistics';

function App() {
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [leagueData, setLeagueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState(null);
  const [news, setNews] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [transfersLoading, setTransfersLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  const [transfersError, setTransfersError] = useState(null);

  useEffect(() => {
    const fetchLeagueData = async () => {
      if (!selectedLeague) {
        console.log('No league selected');
        return;
      }
      
      console.log('Starting to fetch data for league:', selectedLeague);
      setLoading(true);
      setError(null);
      
      try {
        const [standings, teams] = await Promise.all([
          fetchLeagueStandings(selectedLeague.leagueId),
          fetchLeagueTeams(selectedLeague.leagueId)
        ]);
        
        console.log('Successfully fetched data:', { standings, teams });
        
        if (!standings || !Array.isArray(standings)) {
          throw new Error('Invalid standings data received');
        }
        
        setLeagueData({
          standings,
          teams
        });
      } catch (err) {
        console.error('Error in fetchLeagueData:', err);
        setError(err.message || 'Failed to fetch league data. Please try again later.');
        setLeagueData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueData();
  }, [selectedLeague]);

  // Fetch matches for home page
  useEffect(() => {
    const fetchMatchesData = async () => {
      console.log('Starting to fetch matches...');
      setMatchesLoading(true);
      setMatchesError(null);
      
      try {
        // Fetch matches for Premier League by default
        const data = await fetchMatches(39); // Premier League ID
        console.log('Received matches data:', data);
        
        if (!data || !Array.isArray(data)) {
          console.error('Invalid matches data format:', data);
          throw new Error('Invalid matches data format');
        }
        
        setMatches(data);
      } catch (err) {
        console.error('Error in fetchMatchesData:', err);
        setMatchesError(err.message || 'Failed to fetch matches. Please try again later.');
        setMatches([]);
      } finally {
        setMatchesLoading(false);
      }
    };

    if (activeTab === 'home') {
      console.log('Home tab active, fetching matches...');
      fetchMatchesData();
    }
  }, [activeTab]);

  // Fetch news and transfers for home page
  useEffect(() => {
    const fetchNewsAndTransfers = async () => {
      if (activeTab === 'home') {
        // Fetch news
        setNewsLoading(true);
        setNewsError(null);
        try {
          const newsData = await fetchNews();
          setNews(newsData);
        } catch (err) {
          console.error('Error fetching news:', err);
          setNewsError(err.message || 'Failed to fetch news');
        } finally {
          setNewsLoading(false);
        }

        // Fetch transfers
        setTransfersLoading(true);
        setTransfersError(null);
        try {
          const transfersData = await fetchTransfers();
          setTransfers(transfersData);
        } catch (err) {
          console.error('Error fetching transfers:', err);
          setTransfersError(err.message || 'Failed to fetch transfers');
        } finally {
          setTransfersLoading(false);
        }
      }
    };

    fetchNewsAndTransfers();
  }, [activeTab]);

  const handleLeagueSelect = (league) => {
    console.log('League selected:', league);
    setSelectedLeague(league);
  };

  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'leagues':
        return (
          <section className="leagues-section">
            <div className="section-header">
              <h2>Football Leagues</h2>
            </div>
            
            <div className="leagues-container">
              {leagues.map(league => (
                <button
                  key={league.leagueId}
                  className={`league-btn ${selectedLeague?.leagueId === league.leagueId ? 'active' : ''}`}
                  onClick={() => handleLeagueSelect(league)}
                >
                  {league.leagueName}
                </button>
              ))}
            </div>

            {loading && (
              <div className="loading">
                Loading league data...
              </div>
            )}

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            {!selectedLeague && !loading && !error && (
              <div className="no-league-selected">
                Please select a league to view standings
              </div>
            )}

            {leagueData && !loading && !error && (
              <div className="league-data">
                <h3>{selectedLeague.leagueName} Standings</h3>
                <div className="standings-table">
                  {leagueData.standings && leagueData.standings.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Pos</th>
                          <th>Team</th>
                          <th>P</th>
                          <th>W</th>
                          <th>D</th>
                          <th>L</th>
                          <th>GF</th>
                          <th>GA</th>
                          <th>GD</th>
                          <th>Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leagueData.standings.map((team) => (
                          <tr key={team.team.id}>
                            <td>{team.rank}</td>
                            <td className="team-cell">
                              <img 
                                src={team.team.logo} 
                                alt={`${team.team.name} logo`} 
                                className="team-logo"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/30?text=No+Logo';
                                }}
                              />
                              <span className="team-name">{team.team.name}</span>
                            </td>
                            <td>{team.all.played}</td>
                            <td>{team.all.win}</td>
                            <td>{team.all.draw}</td>
                            <td>{team.all.lose}</td>
                            <td>{team.all.goals.for}</td>
                            <td>{team.all.goals.against}</td>
                            <td>{team.goalsDiff}</td>
                            <td>{team.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="no-data">No standings data available for this league.</div>
                  )}
                </div>
              </div>
            )}
          </section>
        );
      case 'players':
        return <Players />;
      case 'teams':
        return <Teams />;
      case 'statistics':
        return <Statistics />;
      case 'home':
      default:
        return (
          <>
            <section className="live-matches">
              <div className="section-header">
                <h2>Upcoming Matches</h2>
                <a href="#" className="view-all">View All <i className="fas fa-chevron-right"></i></a>
              </div>
              
              <div className="match-filter">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Live</button>
                <button className="filter-btn">Finished</button>
                <button className="filter-btn">Upcoming</button>
              </div>
              
              <div className="matches-container">
                {matchesLoading && (
                  <div className="loading">
                    Loading matches...
                  </div>
                )}

                {matchesError && (
                  <div className="error">
                    {matchesError}
                  </div>
                )}

                {!matchesLoading && !matchesError && matches.length === 0 && (
                  <div className="no-data">
                    No matches available at the moment.
                  </div>
                )}

                {!matchesLoading && !matchesError && matches.length > 0 && (
                  <div className="matches-grid">
                    {matches.map((match) => (
                      <div key={match.fixture.id} className="match-card">
                        <div className="match-header">
                          <span className="match-date">{formatMatchDate(match.fixture.date)}</span>
                          <span className="match-status">{match.fixture.status.short}</span>
                        </div>
                        <div className="match-teams">
                          <div className="team">
                            <img 
                              src={match.teams.home.logo} 
                              alt={match.teams.home.name} 
                              className="team-logo"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/30?text=No+Logo';
                              }}
                            />
                            <span className="team-name">{match.teams.home.name}</span>
                          </div>
                          <div className="match-score">
                            {match.goals.home !== null ? match.goals.home : '-'} - {match.goals.away !== null ? match.goals.away : '-'}
                          </div>
                          <div className="team">
                            <img 
                              src={match.teams.away.logo} 
                              alt={match.teams.away.name} 
                              className="team-logo"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/30?text=No+Logo';
                              }}
                            />
                            <span className="team-name">{match.teams.away.name}</span>
                          </div>
                        </div>
                        <div className="match-footer">
                          <span className="match-venue">{match.fixture.venue.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="news-section">
              <div className="section-header">
                <h2>Latest News</h2>
                <a href="#" className="view-all">View All <i className="fas fa-chevron-right"></i></a>
              </div>
              
              <div className="news-container">
                {newsLoading && (
                  <div className="loading">
                    Loading news...
                  </div>
                )}

                {newsError && (
                  <div className="error">
                    {newsError}
                  </div>
                )}

                {!newsLoading && !newsError && news.length === 0 && (
                  <div className="no-data">
                    No news available at the moment.
                  </div>
                )}

                {!newsLoading && !newsError && news.length > 0 && (
                  <div className="news-grid">
                    {news.map((item) => (
                      <div key={item.id} className="news-card">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="news-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                        <div className="news-content">
                          <h3 className="news-title">{item.title}</h3>
                          <p className="news-description">{item.description}</p>
                          <div className="news-meta">
                            <span className="news-date">{new Date(item.date).toLocaleDateString()}</span>
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="read-more">
                              Read More
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="transfers-section">
              <div className="section-header">
                <h2>Latest Transfers</h2>
                <a href="#" className="view-all">View All <i className="fas fa-chevron-right"></i></a>
              </div>
              
              <div className="transfers-container">
                {transfersLoading && (
                  <div className="loading">
                    Loading transfers...
                  </div>
                )}

                {transfersError && (
                  <div className="error">
                    {transfersError}
                  </div>
                )}

                {!transfersLoading && !transfersError && transfers.length === 0 && (
                  <div className="no-data">
                    No transfers available at the moment.
                  </div>
                )}

                {!transfersLoading && !transfersError && transfers.length > 0 && (
                  <div className="transfers-grid">
                    {transfers.map((transfer) => (
                      <div key={transfer.id} className="transfer-card">
                        <div className="transfer-teams">
                          <div className="team">
                            <img 
                              src={transfer.from.team.logo} 
                              alt={transfer.from.team.name} 
                              className="team-logo"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/30?text=No+Logo';
                              }}
                            />
                            <span className="team-name">{transfer.from.team.name}</span>
                          </div>
                          <div className="transfer-arrow">
                            <i className="fas fa-arrow-right"></i>
                          </div>
                          <div className="team">
                            <img 
                              src={transfer.to.team.logo} 
                              alt={transfer.to.team.name} 
                              className="team-logo"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/30?text=No+Logo';
                              }}
                            />
                            <span className="team-name">{transfer.to.team.name}</span>
                          </div>
                        </div>
                        <div className="transfer-player">
                          <img 
                            src={transfer.player.photo} 
                            alt={transfer.player.name} 
                            className="player-photo"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/50?text=No+Photo';
                            }}
                          />
                          <span className="player-name">{transfer.player.name}</span>
                        </div>
                        <div className="transfer-details">
                          <span className="transfer-type">{transfer.type}</span>
                          <span className="transfer-date">{new Date(transfer.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="App">
      <header>
        <div className="logo-container">
          <h1><i className="fas fa-futbol"></i> KickStats Hub</h1>
        </div>
        <nav>
          <ul>
            <li>
              <a 
                href="#" 
                className={activeTab === 'home' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('home');
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={activeTab === 'leagues' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('leagues');
                }}
              >
                Leagues
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={activeTab === 'players' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('players');
                }}
              >
                Players
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={activeTab === 'teams' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('teams');
                }}
              >
                Teams
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={activeTab === 'statistics' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('statistics');
                }}
              >
                Statistics
              </a>
            </li>
          </ul>
        </nav>
        <div className="search-container">
          <input type="text" placeholder="Search teams, players..." />
          <button><i className="fas fa-search"></i></button>
        </div>
      </header>

      <main>
        {renderContent()}
      </main>

      <footer>
        <div className="footer-columns">
          <div className="footer-column">
            <h3>KickStats Hub</h3>
            <p>Your one-stop destination for live football statistics, scores, and news from around the world.</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Top Leagues</a></li>
              <li><a href="#">Popular Teams</a></li>
              <li><a href="#">Star Players</a></li>
              <li><a href="#">Upcoming Fixtures</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">API Access</a></li>
              <li><a href="#">Statistics Guide</a></li>
              <li><a href="#">Football Terms</a></li>
              <li><a href="#">Historical Data</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li><i className="fas fa-envelope"></i> info@kickstatshub.com</li>
              <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
              <li><i className="fas fa-map-marker-alt"></i> California, US</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 KickStats Hub. All rights reserved.</p>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;