import React, { useState, useEffect } from 'react';
import './App.css';

// Sample data imports (in a real app, you'd fetch this from an API)
import { matchesData, newsData } from './data';

function App() {
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [matchFilter, setMatchFilter] = useState('all');
  const [newsCategory, setNewsCategory] = useState('all');

  useEffect(() => {
    // Filter matches based on selected filter
    const filteredMatches = matchFilter === 'all' 
      ? matchesData 
      : matchesData.filter(match => match.status === matchFilter);
    
    setMatches(filteredMatches);
  }, [matchFilter]);

  useEffect(() => {
    // Filter news based on selected category
    const filteredNews = newsCategory === 'all' 
      ? newsData 
      : newsData.filter(item => item.category === newsCategory);
    
    setNews(filteredNews);
  }, [newsCategory]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="App">
      <header>
        <div className="logo-container">
          <h1><i className="fas fa-futbol"></i> KickStats Hub</h1>
        </div>
        <nav>
          <ul>
            <li><a href="#" className="active">Home</a></li>
            <li><a href="#">Leagues</a></li>
            <li><a href="#">Teams</a></li>
            <li><a href="#">Players</a></li>
            <li><a href="#">Statistics</a></li>
          </ul>
        </nav>
        <div className="search-container">
          <input type="text" placeholder="Search teams, players..." />
          <button><i className="fas fa-search"></i></button>
        </div>
      </header>

      <main>
        <section className="live-matches">
          <div className="section-header">
            <h2>Live & Recent Matches</h2>
            <a href="#" className="view-all">View All <i className="fas fa-chevron-right"></i></a>
          </div>
          
          <div className="match-filter">
            <button 
              className={`filter-btn ${matchFilter === 'all' ? 'active' : ''}`}
              onClick={() => setMatchFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${matchFilter === 'live' ? 'active' : ''}`}
              onClick={() => setMatchFilter('live')}
            >
              Live
            </button>
            <button 
              className={`filter-btn ${matchFilter === 'finished' ? 'active' : ''}`}
              onClick={() => setMatchFilter('finished')}
            >
              Finished
            </button>
            <button 
              className={`filter-btn ${matchFilter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setMatchFilter('upcoming')}
            >
              Upcoming
            </button>
          </div>
          
          <div className="matches-container">
            {matches.map(match => (
              <div className="match-card" key={match.id}>
                <div className="match-league">
                  <img src={match.league.logo} alt={match.league.name} />
                  {match.league.name}
                </div>
                <div className="match-teams">
                  <div className="team">
                    <img src={match.homeTeam.logo} alt={match.homeTeam.name} />
                    <span className="team-name">{match.homeTeam.name}</span>
                  </div>
                  <div className="match-score">
                    {match.score.home} - {match.score.away}
                  </div>
                  <div className="team">
                    <img src={match.awayTeam.logo} alt={match.awayTeam.name} />
                    <span className="team-name">{match.awayTeam.name}</span>
                  </div>
                </div>
                <div className={`match-status ${match.status === 'live' ? 'live' : ''}`}>
                  {match.status === 'live' && <span className="live-indicator"></span>} 
                  {match.time}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="news-section">
          <div className="section-header">
            <h2>Latest Football News</h2>
            <a href="#" className="view-all">View All <i className="fas fa-chevron-right"></i></a>
          </div>
          
          <div className="news-filter">
            <button 
              className={`filter-btn ${newsCategory === 'all' ? 'active' : ''}`}
              onClick={() => setNewsCategory('all')}
            >
              All News
            </button>
            <button 
              className={`filter-btn ${newsCategory === 'transfers' ? 'active' : ''}`}
              onClick={() => setNewsCategory('transfers')}
            >
              Transfers
            </button>
            <button 
              className={`filter-btn ${newsCategory === 'teams' ? 'active' : ''}`}
              onClick={() => setNewsCategory('teams')}
            >
              Teams
            </button>
            <button 
              className={`filter-btn ${newsCategory === 'players' ? 'active' : ''}`}
              onClick={() => setNewsCategory('players')}
            >
              Players
            </button>
          </div>
          
          <div className="news-container">
            {news.map(item => (
              <div className="news-card" key={item.id}>
                <div className="news-image">
                  <img src={item.image} alt={item.title} />
                  <span className={`news-category ${item.category}`}>{item.category}</span>
                </div>
                <div className="news-content">
                  <div className="news-date">{formatDate(item.date)}</div>
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-summary">{item.summary}</p>
                  <a href="#" className="read-more">Read Full Story <i className="fas fa-arrow-right"></i></a>
                </div>
              </div>
            ))}
          </div>
        </section>
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
          {/* Additional footer columns */}
        </div>
        <div className="footer-bottom">
          <p>© 2025 KickStats Hub. All rights reserved.</p>
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