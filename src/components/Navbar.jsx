import React from 'react';

export default function Navbar({ onStartStory, onOpenChat, activeTab = 'home' }) {
  return (
    <header className="navbar-container">
      <a href="#home" className="brand-logo">
        <img src="/title.webp" alt="Sprout Title" className="brand-title-image" />
      </a>

      <nav>
        <ul className="nav-links">
          <li>
            <button className={`nav-item-btn ${activeTab === 'home' ? 'active' : ''}`}>
              Home
            </button>
          </li>
          <li>
            <button 
              className="story-mode-nav-btn"
              onClick={onStartStory}
              title="Enter Story Mode"
            >
              <img 
                src="/story/1 pc.webp" 
                alt="Story Mode Preview" 
                className="circle-thumb"
              />
              <span>Story</span>
            </button>
          </li>
          <li>
            <button className="nav-item-btn">
              Powers
            </button>
          </li>
          <li>
            <button className="nav-item-btn">
              Mission
            </button>
          </li>
          <li>
            <button className="nav-item-btn" onClick={onOpenChat}>
              🌱 Talk to Sprout
            </button>
          </li>
        </ul>
      </nav>

      <button className="nav-cta-pill" onClick={onOpenChat}>
        <span>🌱</span> Talk to Sprout
      </button>
    </header>
  );
}
