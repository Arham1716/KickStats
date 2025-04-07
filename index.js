import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// DOM Elements
const matchesContainer = document.getElementById('matches-container');
const newsContainer = document.getElementById('news-container');
const matchFilterBtns = document.querySelectorAll('.match-filter .filter-btn');
const newsFilterBtns = document.querySelectorAll('.news-filter .filter-btn');

// Sample data for matches
const matchesData = [
    {
        id: 1,
        league: {
            name: 'Premier League',
            logo: '/api/placeholder/16/16'
        },
        homeTeam: {
            name: 'Arsenal',
            logo: '/api/placeholder/40/40'
        },
        awayTeam: {
            name: 'Chelsea',
            logo: '/api/placeholder/40/40'
        },
        score: {
            home: 2,
            away: 1
        },
        status: 'live',
        time: '75\'',
        date: '2025-03-21T15:00:00'
    },
    {
        id: 2,
        league: {
            name: 'La Liga',
            logo: '/api/placeholder/16/16'
        },
        homeTeam: {
            name: 'Barcelona',
            logo: '/api/placeholder/40/40'
        },
        awayTeam: {
            name: 'Real Madrid',
            logo: '/api/placeholder/40/40'
        },
        score: {
            home: 1,
            away: 1
        },
        status: 'live',
        time: '60\'',
        date: '2025-03-21T17:00:00'
    },
    {
        id: 3,
        league: {
            name: 'Serie A',
            logo: '/api/placeholder/16/16'
        },
        homeTeam: {
            name: 'AC Milan',
            logo: '/api/placeholder/40/40'
        },
        awayTeam: {
            name: 'Inter Milan',
            logo: '/api/placeholder/40/40'
        },
        score: {
            home: 0,
            away: 2
        },
        status: 'finished',
        time: 'FT',
        date: '2025-03-21T12:30:00'
    },
    {
        id: 4,
        league: {
            name: 'Bundesliga',
            logo: '/api/placeholder/16/16'
        },
        homeTeam: {
            name: 'Bayern Munich',
            logo: '/api/placeholder/40/40'
        },
        awayTeam: {
            name: 'Borussia Dortmund',
            logo: '/api/placeholder/40/40'
        },
        score: {
            home: 3,
            away: 1
        },
        status: 'finished',
        time: 'FT',
        date: '2025-03-20T19:45:00'
    },
    {
        id: 5,
        league: {
            name: 'Ligue 1',
            logo: '/api/placeholder/16/16'
        },
        homeTeam: {
            name: 'PSG',
            logo: '/api/placeholder/40/40'
        },
        awayTeam: {
            name: 'Marseille',
            logo: '/api/placeholder/40/40'
        },
        score: {
            home: 0,
            away: 0
        },
        status: 'upcoming',
        time: '20:45',
        date: '2025-03-21T20:45:00'
    },
    {
        id: 6,
        league: {
            name: 'Champions League',
            logo: '/api/placeholder/16/16'
        },
        homeTeam: {
            name: 'Man City',
            logo: '/api/placeholder/40/40'
        },
        awayTeam: {
            name: 'Juventus',
            logo: '/api/placeholder/40/40'
        },
        score: {
            home: 0,
            away: 0
        },
        status: 'upcoming',
        time: '21:00',
        date: '2025-03-22T21:00:00'
    }
];

// Sample data for news
const newsData = [
    {
        id: 1,
        title: 'Mbappé to Real Madrid: Transfer Deal Confirmed',
        summary: 'After years of speculation, Kylian Mbappé has finally sealed his dream move to Real Madrid in a record-breaking transfer deal.',
        image: '/api/placeholder/350/180',
        category: 'transfers',
        date: '2025-03-21T13:45:00'
    },
    {
        id: 2,
        title: 'Barcelona Appoints New Manager After Disappointing Season',
        summary: 'FC Barcelona has appointed a new head coach following a trophy-less campaign, with the board promising a return to the club\'s core values.',
        image: '/api/placeholder/350/180',
        category: 'teams',
        date: '2025-03-21T10:20:00'
    },
    {
        id: 3,
        title: 'Haaland Breaks Premier League Scoring Record',
        summary: 'Erling Haaland has broken the Premier League single-season scoring record, surpassing the previous mark with five games still to play.',
        image: '/api/placeholder/350/180',
        category: 'players',
        date: '2025-03-20T22:15:00'
    },
    {
        id: 4,
        title: 'Chelsea Completes Triple Signing of South American Talents',
        summary: 'Chelsea FC has finalized deals for three promising young South American players as part of their long-term recruitment strategy.',
        image: '/api/placeholder/350/180',
        category: 'transfers',
        date: '2025-03-20T18:30:00'
    },
    {
        id: 5,
        title: 'Liverpool Unveils Stadium Expansion Plans',
        summary: 'Liverpool FC has revealed ambitious plans to expand Anfield further, increasing capacity and adding state-of-the-art facilities.',
        image: '/api/placeholder/350/180',
        category: 'teams',
        date: '2025-03-20T14:10:00'
    },
    {
        id: 6,
        title: 'De Bruyne Announces International Retirement',
        summary: 'Manchester City midfielder Kevin De Bruyne has announced his retirement from international football to focus on extending his club career.',
        image: '/api/placeholder/350/180',
        category: 'players',
        date: '2025-03-19T16:45:00'
    }
];

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

// Render matches based on filter
function renderMatches(filter = 'all') {
    matchesContainer.innerHTML = '';
    
    const filteredMatches = filter === 'all' 
        ? matchesData 
        : matchesData.filter(match => match.status === filter);
    
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

// Render news based on filter
function renderNews(category = 'all') {
    newsContainer.innerHTML = '';
    
    const filteredNews = category === 'all' 
        ? newsData 
        : newsData.filter(news => news.category === category);
    
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

// Add event listeners to match filter buttons
matchFilterBtns.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        matchFilterBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value and render matches
        const filter = button.getAttribute('data-filter');
        renderMatches(filter);
    });
});

// Add event listeners to news filter buttons
newsFilterBtns.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        newsFilterBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get category value and render news
        const category = button.getAttribute('data-category');
        renderNews(category);
    });
});

// Initial render
// Initial render
document.addEventListener('DOMContentLoaded', () => {
  const matchesContainer = document.getElementById('matches-container');
  const newsContainer = document.getElementById('news-container');
  
  if (matchesContainer && newsContainer) {
      renderMatches();
      renderNews();
  } else {
      console.error('Could not find required containers');
  }
});

reportWebVitals();

