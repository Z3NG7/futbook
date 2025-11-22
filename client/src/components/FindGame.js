import { useState } from "react";
import "./FindGame.css"; // ← NEW CSS FILE

import { Card, CardContent } from "./ui/card.js";
import { Button } from "./ui/button.js";
import { Badge } from "./ui/badge.js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.js";
import { Input } from "./ui/input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.js";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog.js";

import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Users,
  Trophy,
  Shield,
  Filter,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

import { toast } from "sonner";

export function FindGame({ openLobbies, onBack, onJoinLobby, onViewLobbyDetails }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLobby, setSelectedLobby] = useState(null);

  const sports = Array.from(new Set(openLobbies.map((l) => l.sport)));
  const locations = Array.from(new Set(openLobbies.map((l) => l.location)));
  const dates = Array.from(new Set(openLobbies.map((l) => l.date)));

  const filteredLobbies = openLobbies.filter((lobby) => {
    const matchesSearch =
      lobby.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lobby.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lobby.sport.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSport = selectedSport === "all" || lobby.sport === selectedSport;
    const matchesLocation = selectedLocation === "all" || lobby.location === selectedLocation;
    const matchesDate = selectedDate === "all" || lobby.date === selectedDate;

    return matchesSearch && matchesSport && matchesLocation && matchesDate;
  });

  const handleJoinRequest = (lobbyId) => {
    onJoinLobby(lobbyId);
    toast.success("Join request sent! The host will review your request.");
  };

  return (
    <div className="findgame-page">
      {/* Header */}
      <div className="findgame-header">
        <div className="findgame-header-inner">
          <Button variant="ghost" onClick={onBack} className="findgame-back-btn">
            ← Back
          </Button>

          <div className="findgame-title-row">
            <Trophy className="findgame-title-icon" />
            <h1 className="findgame-title">Find a Game</h1>
          </div>

          {/* Search */}
          <div className="findgame-search-block">
            <div className="findgame-search-row">
              <div className="findgame-search-input-wrapper">
                <Search className="findgame-search-icon" />
                <Input
                  placeholder="Search by venue, location, or sport..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="findgame-search-input"
                />
              </div>

              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="findgame-filter-btn"
              >
                <Filter className="findgame-filter-icon" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="findgame-filters-panel">
                <div className="findgame-filter-item">
                  <label className="findgame-filter-label">Sport</label>
                  <Select value={selectedSport} onValueChange={setSelectedSport}>
                    <SelectTrigger className="findgame-select">
                      <SelectValue placeholder="Select Sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sports</SelectItem>
                      {sports.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="findgame-filter-item">
                  <label className="findgame-filter-label">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="findgame-select">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="findgame-filter-item">
                  <label className="findgame-filter-label">Date</label>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger className="findgame-select">
                      <SelectValue placeholder="Select Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      {dates.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <p className="findgame-result-count">
              {filteredLobbies.length} open {filteredLobbies.length === 1 ? "game" : "games"} found
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="findgame-content">
        {filteredLobbies.length === 0 ? (
          <Card>
            <CardContent className="findgame-empty">
              <Trophy className="findgame-empty-icon" />
              <h3 className="findgame-empty-title">No games found</h3>
              <p className="findgame-empty-text">Try adjusting your filters</p>
              <Button onClick={onBack}>Browse Venues</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="findgame-list">
            {filteredLobbies.map((lobby) => (
              <Card key={lobby.id} className="findgame-card">
                <div className="findgame-card-row">
                  <div className="findgame-card-image">
                    <img src={lobby.image} alt={lobby.venue} />
                  </div>

                  <div className="findgame-card-content">
                    <h3 className="findgame-card-title">{lobby.venue}</h3>

                    <div className="findgame-badges">
                      <Badge>{lobby.sport}</Badge>
                      <Badge>{lobby.skillLevel}</Badge>
                    </div>

                    <div className="findgame-info-grid">
                      <div className="findgame-info-item">
                        <MapPin />
                        <span>{lobby.location}</span>
                      </div>

                      <div className="findgame-info-item">
                        <Calendar />
                        <span>{lobby.date}</span>
                      </div>

                      <div className="findgame-info-item">
                        <Clock />
                        <span>{lobby.timeSlot}</span>
                      </div>

                      <div className="findgame-info-item">
                        <TrendingUp />
                        <span>{lobby.distance} km</span>
                      </div>
                    </div>

                    <div className="findgame-host">
                      <Avatar>
                        <AvatarImage src={lobby.hostAvatar} />
                        <AvatarFallback>{lobby.hostName.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p>
                          Hosted by <strong>{lobby.hostName}</strong>
                        </p>
                      </div>
                    </div>

                    {lobby.description && (
                      <p className="findgame-description">{lobby.description}</p>
                    )}

                    <div className="findgame-actions">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="findgame-join-btn"
                            onClick={() => setSelectedLobby(lobby)}
                          >
                            <CheckCircle />
                            Request to Join
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Join Game Request</DialogTitle>
                            <DialogDescription>
                              Send a request to join this game.
                            </DialogDescription>
                          </DialogHeader>

                          <Button onClick={() => handleJoinRequest(lobby.lobbyId)}>
                            Confirm Join
                          </Button>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        onClick={() => onViewLobbyDetails(lobby.lobbyId)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
