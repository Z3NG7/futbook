import { useState } from "react";
import "./Header.css";
import { searchVenues } from "../services/venueSearchService.js";

import { Input } from "./ui/input.js";
import { Button } from "./ui/button.js";

import { 
  Search, 
  MapPin, 
  Filter,
  Zap,
  Calendar,
  User
} from "lucide-react";

const locations = [
  "All Locations",
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Biratnagar",
  "Dolakha"
];

export function Header({ onResults }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [showFilters, setShowFilters] = useState(false);

  // price
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);

  const handleSearch = async () => {
    const response = await searchVenues({
      query,
      city:location,
      minPrice,
      maxPrice,
    });

    if (response.success) onResults(response.data);
    else onResults([]);
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* TOP BAR */}
        <div className="header-topbar">
          <div className="header-logo-area">
            <div className="logo-icon">
              <Zap className="icon-emerald" />
            </div>
            <h1 className="logo-text">SportVenue</h1>
          </div>

          <div className="header-buttons">
            <Button variant="ghost" className="header-nav-btn">
              <Calendar className="nav-icon" />
              My Bookings
            </Button>

            <Button variant="ghost" className="header-nav-btn">
              <User className="nav-icon" />
              Profile
            </Button>
          </div>
        </div>

        {/* HERO */}
        <div className="header-hero">
          <h2 className="hero-title">Find Your Perfect Sports Venue</h2>
          <p className="hero-subtitle">Book premium courts and turfs in your city</p>
        </div>

        {/* SEARCH BLOCK */}
        <div className="search-wrapper">
          <div className="search-box">

            <div className="search-input-wrapper">
              <Search className="search-input-icon" />
              <Input
                placeholder="Search venues or locations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="location-select-wrapper">
              <MapPin className="location-icon" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="location-select"
              >
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="filter-btn"
            >
              <Filter className="filter-icon" />
              Filters
            </Button>

            <Button className="search-btn" onClick={handleSearch}>
              Search
            </Button>
          </div>

          {/* PRICE FILTER */}
          {showFilters && (
            <div className="filters-panel">

              <div className="price-filter">
                <span className="filter-title">Price Range (Rs)</span>

                <div className="price-inputs">
                  <div>
                    <label className="price-label">Min</label>
                    <Input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="price-input"
                    />
                  </div>

                  <div>
                    <label className="price-label">Max</label>
                    <Input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="price-input"
                    />
                  </div>

                  <Button className="apply-price-btn" onClick={handleSearch}>
                    Apply
                  </Button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
