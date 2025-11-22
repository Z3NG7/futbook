
import React, { useState } from 'react';

import { SITE_NAME } from "./../config";

const HomeHeader = () => {

     const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuthClick = () => {
    setIsLoggedIn(!isLoggedIn); // Toggle between Sign In and Sign Out
  };

    return (

     <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <svg width="102" height="32" viewBox="0 0 102 32" fill="currentColor">
              <path d="M51.5 15.5c0 5.8-4.7 10.5-10.5 10.5S30.5 21.3 30.5 15.5 35.2 5 41 5s10.5 4.7 10.5 10.5zm-2 0c0-4.7-3.8-8.5-8.5-8.5s-8.5 3.8-8.5 8.5 3.8 8.5 8.5 8.5 8.5-3.8 8.5-8.5z" />
              <path d="M29.5 15.5c0-6.9-5.6-12.5-12.5-12.5S4.5 8.6 4.5 15.5 10.1 28 17 28s12.5-5.6 12.5-12.5zm-2 0c0 5.8-4.7 10.5-10.5 10.5S6.5 21.3 6.5 15.5 11.2 5 17 5s10.5 4.7 10.5 10.5z" />
            </svg>
            <span className="logo-text">{SITE_NAME}</span>
          </div>

          {/* Navigation */}
          <nav className="nav">
            <a href="#" className="nav-link active">
              <span className="nav-icon">🏠</span>
              Homes
            </a>
            <a href="#" className="nav-link">
              <span className="nav-icon">🚩</span>
              Lobbies
            
            </a>
            <a href="#" className="nav-link">
              <span className="nav-icon">💬</span>
              Chat
           
            </a>
          </nav>

          {/* Right Menu */}
          {/* <div className="header-right">
            <a href="#" className="host-link">Become a host</a>
            <button className="icon-btn">🌐</button>
            <button className="icon-btn menu-btn">☰</button>
          </div> */}

          {/* Sign In / Sign Out Button */}
          <div className="header-right">
            {isLoggedIn ? (
              <button className="auth-btn" onClick={handleAuthClick}>
                Sign Out
              </button>
            ) : (
              <button className="auth-btn" onClick={handleAuthClick}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
    )
}

export default HomeHeader;