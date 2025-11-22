import React, { useState } from "react";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters); // Toggle visibility of filters
  };

  return (
    <div className="search-section">
      <div className="container">
        <div className="search-bar">
          {/* Location Filter */}
          <div className="search-item">
            <label>Where</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Icon */}
          <div className="filter-icon" onClick={toggleFilters}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1V15M1 8H15" stroke="#222" strokeWidth="2" />
            </svg>
          </div>

          {/* Search Button */}
          <button className="search-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M11.5 7a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM15 14l-3.5-3.5" />
            </svg>
          </button>
        </div>

        {/* Filters (only visible when showFilters is true) */}
        {showFilters && (
          <div className="filters-dropdown">
            <div className="filter-item">
              <label>Ratings</label>
              <select className="filter-select">
                <option value="">Any Rating</option>
                <option value="4">4 ★ & above</option>
                <option value="4.5">4.5 ★ & above</option>
                <option value="5">5 ★ only</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Price</label>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                className="price-range"
              />
              <span className="price-range-value">$0 - $500</span>
            </div>

            <div className="filter-item">
              <label>Distance</label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                className="distance-range"
              />
              <span className="distance-range-value">0 km - 50 km</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
