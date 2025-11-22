import { useState } from "react";
import "./LobbySystem.css";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Button } from "./ui/button.js";
import { Badge } from "./ui/badge.js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.js";
import { Input } from "./ui/input.js";
import { Textarea } from "./ui/textarea.js";
import { Switch } from "./ui/switch.js";
import { Label } from "./ui/label.js";
import { ScrollArea } from "./ui/scroll-area.js";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog.js";

import { 
  Users, 
  UserPlus, 
  Send,
  Shield,
  Copy,
  Lock,
  Unlock,
  MessageSquare,
  CheckCircle,
  XCircle,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Info
} from "lucide-react";

import { toast } from "sonner";

export function LobbySystem({
  lobbyData,
  currentUserId,
  onBack,
  onInvitePlayer,
  onRemovePlayer,
  onAcceptRequest,
  onTogglePublic,
  onSendMessage,
  onCloseLobby
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const isHost = currentUserId === lobbyData.hostId;

  const confirmedPlayers = lobbyData.players.filter((p) => p.status === "confirmed");
  const invitedPlayers = lobbyData.players.filter((p) => p.status === "invited");
  const requestedPlayers = lobbyData.players.filter((p) => p.status === "requested");

  const openSlots = lobbyData.maxPlayers - confirmedPlayers.length;

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onInvitePlayer(inviteEmail);
      setInviteEmail("");
      setShowInviteDialog(false);
      toast.success("Invitation sent!");
    }
  };

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(lobbyData.inviteCode);
    toast.success("Invite code copied!");
  };

  const handleSendChat = () => {
    if (chatMessage.trim()) {
      onSendMessage(chatMessage);
      setChatMessage("");
    }
  };

  const getReliabilityBadge = (score) => {
    if (score >= 90) return { text: "Excellent", color: "lobby-badge-green" };
    if (score >= 75) return { text: "Good", color: "lobby-badge-blue" };
    if (score >= 60) return { text: "Average", color: "lobby-badge-yellow" };
    return { text: "New", color: "lobby-badge-gray" };
  };

  return (
    <div className="lobby-page">
      {/* HEADER */}
      <div className="lobby-header">
        <div className="lobby-header-inner">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="lobby-back-btn"
          >
            ← Back to Bookings
          </Button>

          <div className="lobby-header-main">
            <div className="lobby-header-info">
              <div className="lobby-header-title-row">
                <Users className="lobby-header-icon" />
                <h1 className="lobby-header-title">Team Lobby</h1>
              </div>

              <p className="lobby-header-venue">{lobbyData.venue}</p>

              <div className="lobby-header-meta">
                <div className="lobby-header-meta-item">
                  <Calendar className="lobby-header-meta-icon" />
                  {lobbyData.date}
                </div>
                <div className="lobby-header-meta-item">
                  <Clock className="lobby-header-meta-icon" />
                  {lobbyData.timeSlot}
                </div>
                <div className="lobby-header-meta-item">
                  <MapPin className="lobby-header-meta-icon" />
                  {lobbyData.location}
                </div>
              </div>
            </div>

            <div className="lobby-header-side">
              {/* Players Joined Card */}
              <Card className="lobby-players-card">
                <CardContent className="lobby-players-card-content">
                  <div className="lobby-players-count">
                    {confirmedPlayers.length}/{lobbyData.maxPlayers}
                  </div>
                  <div className="lobby-players-label">Players Joined</div>
                </CardContent>
              </Card>

              {/* PUBLIC / PRIVATE TOGGLE */}
              {isHost && (
                <div className="lobby-public-toggle">
                  <Label htmlFor="public-toggle" className="lobby-public-toggle-label">
                    {lobbyData.isPublic ? (
                      <Unlock className="lobby-public-icon" />
                    ) : (
                      <Lock className="lobby-public-icon" />
                    )}
                  </Label>

                  <Switch
                    id="public-toggle"
                    checked={lobbyData.isPublic}
                    onCheckedChange={onTogglePublic}
                  />

                  <span className="lobby-public-status">
                    {lobbyData.isPublic ? "Public" : "Private"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="lobby-main">
        <div className="lobby-grid">
          {/* LEFT COLUMN */}
          <div className="lobby-left-column">
            {/* INVITE SECTION */}
            {isHost && (
              <Card className="lobby-card">
                <CardHeader>
                  <CardTitle className="lobby-card-title-row">
                    <UserPlus className="lobby-card-title-icon lobby-icon-blue" />
                    <span>Invite Players</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="lobby-card-content">
                  <div className="lobby-invite-actions">
                    <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                      <DialogTrigger asChild>
                        <Button className="lobby-invite-email-btn">
                          <UserPlus className="lobby-btn-icon" />
                          Invite by Email
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invite Player</DialogTitle>
                          <DialogDescription>
                            Send an invitation to join your team lobby
                          </DialogDescription>
                        </DialogHeader>

                        <div className="lobby-dialog-body">
                          <div className="lobby-dialog-field">
                            <Label>Email Address</Label>
                            <Input
                              type="email"
                              placeholder="player@example.com"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                            />
                          </div>

                          <Button onClick={handleInvite} className="lobby-dialog-submit">
                            Send Invitation
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" onClick={handleCopyInviteCode} className="lobby-copy-code-btn">
                      <Copy className="lobby-btn-icon" />
                      Copy Code
                    </Button>
                  </div>

                  <div className="lobby-invite-code-box">
                    <p className="lobby-invite-code-label">Invite Code:</p>

                    <code className="lobby-invite-code">
                      {lobbyData.inviteCode}
                    </code>

                    <p className="lobby-invite-code-help">
                      Share this code with players to let them join directly
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* JOIN REQUESTS */}
            {isHost && requestedPlayers.length > 0 && (
              <Card className="lobby-card">
                <CardHeader>
                  <CardTitle className="lobby-card-title-row">
                    <Info className="lobby-card-title-icon lobby-icon-orange" />
                    <span>Join Requests ({requestedPlayers.length})</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="lobby-card-content">
                  {requestedPlayers.map((player) => {
                    const badge = getReliabilityBadge(player.reliabilityScore);

                    return (
                      <div
                        key={player.id}
                        className="lobby-request-item"
                      >
                        <div className="lobby-request-left">
                          <Avatar>
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="lobby-player-name">{player.name}</p>

                            <Badge className={`lobby-request-badge ${badge.color}`}>
                              <Shield className="lobby-badge-icon" />
                              {player.reliabilityScore}% - {badge.text}
                            </Badge>
                          </div>
                        </div>

                        <div className="lobby-request-actions">
                          <Button
                            size="sm"
                            onClick={() => onAcceptRequest(player.id)}
                            className="lobby-accept-btn"
                          >
                            <CheckCircle className="lobby-btn-icon" />
                            Accept
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRemovePlayer(player.id)}
                            className="lobby-reject-btn"
                          >
                            <XCircle className="lobby-btn-icon" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* CONFIRMED PLAYERS */}
            <Card className="lobby-card">
              <CardHeader>
                <CardTitle className="lobby-card-title-row lobby-card-title-space">
                  <div className="lobby-card-title-left">
                    <Trophy className="lobby-card-title-icon lobby-icon-green" />
                    <span>Team Roster ({confirmedPlayers.length}/{lobbyData.maxPlayers})</span>
                  </div>

                  {openSlots > 0 && (
                    <Badge variant="outline" className="lobby-open-slots-badge">
                      {openSlots} slots open
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="lobby-card-content">
                {confirmedPlayers.map((player) => {
                  const badge = getReliabilityBadge(player.reliabilityScore);
                  const isPlayerHost = player.id === lobbyData.hostId;

                  return (
                    <div
                      key={player.id}
                      className="lobby-player-item"
                    >
                      <div className="lobby-player-left">
                        <Avatar>
                          <AvatarImage src={player.avatar} />
                          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="lobby-player-top-row">
                            <p className="lobby-player-name">{player.name}</p>

                            {isPlayerHost && (
                              <Badge className="lobby-host-badge">
                                Host
                              </Badge>
                            )}
                          </div>

                          <div className="lobby-player-tags">
                            <Badge className={`lobby-request-badge ${badge.color}`}>
                              <Shield className="lobby-badge-icon" />
                              {player.reliabilityScore}%
                            </Badge>

                            {player.position && (
                              <Badge variant="outline" className="lobby-position-badge">
                                {player.position}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {isHost && !isPlayerHost && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemovePlayer(player.id)}
                          className="lobby-remove-btn"
                        >
                          <XCircle className="lobby-btn-icon" />
                        </Button>
                      )}
                    </div>
                  );
                })}

                {/* EMPTY SLOTS */}
                {Array.from({ length: openSlots }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="lobby-open-slot"
                  >
                    <Users className="lobby-open-slot-icon" />
                    <p className="lobby-open-slot-text">Open Slot</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* PENDING INVITES */}
            {isHost && invitedPlayers.length > 0 && (
              <Card className="lobby-card">
                <CardHeader>
                  <CardTitle className="lobby-card-title-row">
                    <Clock className="lobby-card-title-icon lobby-icon-gray" />
                    <span>Pending Invitations ({invitedPlayers.length})</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="lobby-card-content">
                  {invitedPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="lobby-invite-item"
                    >
                      <div className="lobby-invite-left">
                        <Avatar>
                          <AvatarImage src={player.avatar} />
                          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="lobby-player-name">{player.name}</p>
                          <p className="lobby-invite-status">Invitation sent</p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemovePlayer(player.id)}
                        className="lobby-invite-cancel-btn"
                      >
                        Cancel
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN — CHAT */}
          <div className="lobby-right-column">
            <Card className="lobby-chat-card">
              <CardHeader>
                <CardTitle className="lobby-card-title-row">
                  <MessageSquare className="lobby-card-title-icon lobby-icon-blue" />
                  <span>Team Chat</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="lobby-chat-content">
                <ScrollArea className="lobby-chat-messages">
                  <div className="lobby-chat-messages-inner">
                    {lobbyData.chatMessages.map((msg) => (
                      <div key={msg.id} className="lobby-chat-message">
                        <div className="lobby-chat-message-header">
                          <span className="lobby-chat-sender">
                            {msg.senderName}
                          </span>

                          <span className="lobby-chat-timestamp">
                            {msg.timestamp}
                          </span>
                        </div>

                        <div className="lobby-chat-bubble">
                          <p className="lobby-chat-text">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* SEND MESSAGE */}
                <div className="lobby-chat-input-area">
                  <div className="lobby-chat-input-row">
                    <Textarea
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChat();
                        }
                      }}
                      className="lobby-chat-textarea"
                      rows={2}
                    />

                    <Button onClick={handleSendChat} className="lobby-chat-send-btn">
                      <Send className="lobby-btn-icon" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* HOST ACTIONS */}
        {isHost && (
          <Card className="lobby-close-card">
            <CardContent className="lobby-close-card-content">
              <div className="lobby-close-inner">
                <div>
                  <h3 className="lobby-close-title">Lobby Management</h3>

                  <p className="lobby-close-text">
                    Close this lobby to cancel the session and notify all players
                  </p>
                </div>

                <Button variant="destructive" onClick={onCloseLobby}>
                  Close Lobby
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
