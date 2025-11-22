import "./PlayerProfile.css";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar.js";
import { Badge } from "./ui/badge.js";
import { Button } from "./ui/button.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.js";
import { Progress } from "./ui/progress.js";
import { Switch } from "./ui/switch.js";
import { Label } from "./ui/label.js";

import {
  Mail,
  Phone,
  MapPin,
  Star,
  Trophy,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Flame,
  Edit,
  Shield
} from "lucide-react";

export function PlayerProfile({
  playerData,
  onBack,
  onEditProfile,
  onToggleAvailability
}) {
  const badgeIcons = {
    "Early Bird": "🌅",
    "Team Player": "🤝",
    "Loyal Member": "💎",
    "MVP": "🏆",
    "5-Star Player": "⭐",
    "Consistent": "🎯"
  };

  const getReliabilityLevel = (score) => {
    if (score >= 90) return { level: "Excellent", colorClass: "reliability-green" };
    if (score >= 75) return { level: "Good", colorClass: "reliability-blue" };
    if (score >= 60) return { level: "Average", colorClass: "reliability-yellow" };
    return { level: "Needs Improvement", colorClass: "reliability-red" };
  };

  const reliabilityInfo = getReliabilityLevel(playerData.stats.reliabilityScore);

  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-container">

          <Button variant="ghost" onClick={onBack} className="profile-back">
            ← Back
          </Button>

          <div className="profile-header-top">

            {/* AVATAR */}
            <Avatar className="profile-avatar">
              <AvatarImage src={playerData.avatar} alt={playerData.name} />
              <AvatarFallback>{playerData.name.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* INFO */}
            <div className="profile-header-info">
              <div className="profile-name-row">
                <h1 className="profile-name">{playerData.name}</h1>

                <Button size="sm" variant="secondary" onClick={onEditProfile}>
                  <Edit className="icon-sm" />
                  Edit
                </Button>
              </div>

              <div className="profile-contact-row">
                <div className="profile-contact-item">
                  <Mail className="icon-sm" /> {playerData.email}
                </div>
                <div className="profile-contact-item">
                  <Phone className="icon-sm" /> {playerData.phone}
                </div>
                <div className="profile-contact-item">
                  <MapPin className="icon-sm" /> {playerData.location}
                </div>
              </div>

              {/* AVAILABILITY */}
              <div className="profile-availability-row">
                <Label htmlFor="availability">Available to Play</Label>

                <Switch
                  id="availability"
                  checked={playerData.availableToPlay}
                  onCheckedChange={onToggleAvailability}
                />

                {playerData.availableToPlay && (
                  <Badge className="availability-badge">🟢 Open for Matches</Badge>
                )}
              </div>
            </div>

            {/* MINI CARDS */}
            <div className="profile-mini-cards">
              <Card className="mini-card">
                <CardContent className="mini-card-content">
                  <Flame className="mini-card-icon flame" />
                  <div className="mini-card-number">
                    {playerData.stats.loyaltyPoints}
                  </div>
                  <p className="mini-card-label">Loyalty Points</p>
                </CardContent>
              </Card>

              <Card className="mini-card">
                <CardContent className="mini-card-content">
                  <Shield className="mini-card-icon yellow" />
                  <div className="mini-card-number">
                    {playerData.stats.reliabilityScore}%
                  </div>
                  <p className="mini-card-label">Reliability</p>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="profile-container profile-main">

        {/* STATS GRID */}
        <div className="profile-stats-grid">
          <Card className="stat-card">
            <CardContent className="stat-content">
              <div className="stat-icon bg-blue">
                <Calendar />
              </div>
              <div>
                <p className="stat-label">Total Matches</p>
                <p className="stat-value">{playerData.stats.totalMatches}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="stat-content">
              <div className="stat-icon bg-green">
                <Target />
              </div>
              <div>
                <p className="stat-label">Total Bookings</p>
                <p className="stat-value">{playerData.stats.totalBookings}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="stat-content">
              <div className="stat-icon bg-purple">
                <Star />
              </div>
              <div>
                <p className="stat-label">Sportsmanship</p>
                <p className="stat-value">{playerData.stats.sportsmanshipScore}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="stat-content">
              <div className="stat-icon bg-orange">
                <TrendingUp />
              </div>
              <div>
                <p className="stat-label">Teamwork</p>
                <p className="stat-value">{playerData.stats.teamworkScore}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABS */}
        <Tabs defaultValue="performance" className="profile-tabs">

          <TabsList className="profile-tabs-list">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="history">Match History</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          {/* PERFORMANCE */}
          <TabsContent value="performance">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex-center">
                  <Trophy className="icon-sm yellow" />
                  Player Ratings & Performance
                </CardTitle>
              </CardHeader>

              <CardContent className="performance-section">

                {/* Reliability */}
                <div className="performance-item">
                  <div className="performance-title">
                    <Shield className="icon-sm blue" />
                    Reliability
                    <Badge className={reliabilityInfo.colorClass}>
                      {reliabilityInfo.level}
                    </Badge>
                  </div>

                  <Progress value={playerData.stats.reliabilityScore} className="progress" />
                </div>

                {/* Sportsmanship */}
                <div className="performance-item">
                  <div className="performance-title">
                    <Star className="icon-sm purple" />
                    Sportsmanship
                  </div>

                  <Progress value={playerData.stats.sportsmanshipScore} className="progress" />
                </div>

                {/* Teamwork */}
                <div className="performance-item">
                  <div className="performance-title">
                    <TrendingUp className="icon-sm orange" />
                    Teamwork
                  </div>

                  <Progress value={playerData.stats.teamworkScore} className="progress" />
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* MATCH HISTORY */}
          <TabsContent value="history">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex-center">
                  <Calendar className="icon-sm blue" />
                  Recent Matches
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="match-list">
                  {playerData.matchHistory.map((match) => (
                    <div key={match.id} className="match-item">
                      <div>
                        <h4 className="match-title">{match.venue}</h4>
                        <p className="match-date">{match.date}</p>
                      </div>

                      <Badge className="match-sport">
                        {match.sport}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BADGES */}
          <TabsContent value="badges">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex-center">
                  <Award className="icon-sm purple" />
                  Badges & Achievements
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="badges-grid">
                  {playerData.stats.badges.map((badge, i) => (
                    <div key={i} className="badge-item">
                      <div className="badge-icon">
                        {badgeIcons[badge] || "🏅"}
                      </div>
                      <p className="badge-label">{badge}</p>
                    </div>
                  ))}

                  {playerData.stats.badges.length === 0 && (
                    <div className="badge-empty">
                      <Award className="icon-lg gray" />
                      <p>No badges yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
}
