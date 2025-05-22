import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// === Dummy Data Definitions (replace with real data or imports) ===
const matchesData = []; // Replace with actual matches data or import
const newsData = []; // Replace with actual news data or import

// DOM Elements
const matchesContainer = document.getElementById('matches-container');
const newsContainer = document.getElementById('news-container');
const matchFilterBtns = document.querySelectorAll('.match-filter .filter-btn');
const newsFilterBtns = document.querySelectorAll('.news-filter .filter-btn');

// === ENHANCEMENTS BEGIN HERE ===
const matchSearchInput = document.getElementById('match-search');
const matchSortSelect = document.getElementById('match-sort');
const matchLeagueSelect = document.getElementById('match-league');

const newsSearchInput = document.getElementById('news-search');
const newsSortSelect = document.getElementById('news-sort');
// === ENHANCEMENTS END SETUP ===

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderMatches(filter = 'all') {
  if (!matchesContainer) return;
  matchesContainer.innerHTML = '';
  const searchQuery = matchSearchInput?.value?.toLowerCase() || '';
  const sortOption = matchSortSelect?.value || '';
  const leagueFilter = matchLeagueSelect?.value || 'all';

  let filteredMatches = filter === 'all' 
    ? matchesData 
    : matchesData.filter(match => match.status === filter);

  // Apply search
  if (searchQuery) {
    filteredMatches = filteredMatches.filter(match =>
      match.homeTeam.name.toLowerCase().includes(searchQuery) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery)
    );
  }

  // Apply league filter
  if (leagueFilter !== 'all') {
    filteredMatches = filteredMatches.filter(match => match.league.name === leagueFilter);
  }

  // Sort
  if (sortOption === 'time-asc') {
    filteredMatches.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortOption === 'time-desc') {
    filteredMatches.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  filteredMatches.forEach(match => {
    const matchCard = document.createElement('div');
    matchCard.className = 'match-card';
    const isLive = match.status === 'live';
    const statusClass = isLive ? 'match-status live' : 'match-status';
    const liveIndicator = isLive ? '<span class="live-indicator"></span>' : '';

    matchCard.innerHTML = `
      <div class="match-league">
        <img src="${match.league.logo}" alt="${match.league.name}">
        ${match.league.name}
      </div>
      <div class="match-teams">
        <div class="team">
          <img src="${match.homeTeam.logo}" alt="${match.homeTeam.name}">
          <span class="team-name">${match.homeTeam.name}</span>
        </div>
        <div class="match-score">
          ${match.score.home} - ${match.score.away}
        </div>
        <div class="team">
          <img src="${match.awayTeam.logo}" alt="${match.awayTeam.name}">
          <span class="team-name">${match.awayTeam.name}</span>
        </div>
      </div>
      <div class="${statusClass}">
        ${liveIndicator} ${match.time}
      </div>
    `;
    matchesContainer.appendChild(matchCard);
  });
}

function renderNews(category = 'all') {
  if (!newsContainer) return;
  newsContainer.innerHTML = '';
  const searchQuery = newsSearchInput?.value?.toLowerCase() || '';
  const sortOption = newsSortSelect?.value || '';

  let filteredNews = category === 'all' 
    ? newsData 
    : newsData.filter(news => news.category === category);

  // Apply search
  if (searchQuery) {
    filteredNews = filteredNews.filter(news =>
      news.title.toLowerCase().includes(searchQuery) ||
      news.summary.toLowerCase().includes(searchQuery)
    );
  }

  // Sort
  if (sortOption === 'latest') {
    filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortOption === 'oldest') {
    filteredNews.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  filteredNews.forEach(news => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';

    newsCard.innerHTML = `
      <div class="news-image">
        <img src="${news.image}" alt="${news.title}">
        <span class="news-category ${news.category}">${news.category}</span>
      </div>
      <div class="news-content">
        <div class="news-date">${formatDate(news.date)}</div>
        <h3 class="news-title">${news.title}</h3>
        <p class="news-summary">${news.summary}</p>
        <a href="#" class="read-more">Read Full Story <i class="fas fa-arrow-right"></i></a>
      </div>
    `;
    newsContainer.appendChild(newsCard);
  });
}

// Event Listeners
matchFilterBtns.forEach(button => {
  button.addEventListener('click', () => {
    matchFilterBtns.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.getAttribute('data-filter');
    renderMatches(filter);
  });
});

newsFilterBtns.forEach(button => {
  button.addEventListener('click', () => {
    newsFilterBtns.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const category = button.getAttribute('data-category');
    renderNews(category);
  });
});

matchSearchInput?.addEventListener('input', () => {
  const activeBtn = document.querySelector('.match-filter .filter-btn.active');
  renderMatches(activeBtn?.getAttribute('data-filter') || 'all');
});
matchSortSelect?.addEventListener('change', () => {
  const activeBtn = document.querySelector('.match-filter .filter-btn.active');
  renderMatches(activeBtn?.getAttribute('data-filter') || 'all');
});
matchLeagueSelect?.addEventListener('change', () => {
  const activeBtn = document.querySelector('.match-filter .filter-btn.active');
  renderMatches(activeBtn?.getAttribute('data-filter') || 'all');
});

newsSearchInput?.addEventListener('input', () => {
  const activeBtn = document.querySelector('.news-filter .filter-btn.active');
  renderNews(activeBtn?.getAttribute('data-category') || 'all');
});
newsSortSelect?.addEventListener('change', () => {
  const activeBtn = document.querySelector('.news-filter .filter-btn.active');
  renderNews(activeBtn?.getAttribute('data-category') || 'all');
});

// Initial render
renderMatches();
renderNews();

// === React Root Render ===
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
