import "./UpcomingBookings.css";
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

import {
  Calendar,
  Clock,
  MapPin,
  X,
  Share2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

import { toast } from "sonner";

export function UpcomingBookings({ onBack }) {
  const [bookings, setBookings] = useState([]);
  const [selectedTab, setSelectedTab] = useState("upcoming");

  const parseStartTime = (slot) => slot.split(" - ")[0];
  const makeDateTime = (date, timeSlot) =>
    new Date(`${date}T${parseStartTime(timeSlot)}:00`);

  // FETCH BOOKINGS
  useEffect(() => {
    async function load() {
      try {
        const userId = "TEMP_USER_001";

        const res = await fetch(
          `http://localhost:5000/api/bookings/user/${userId}`
        );
        const data = await res.json();
        if (!data.success) return toast.error("Failed to load bookings");

        setBookings(data.data);
      } catch (err) {
        toast.error("Server error");
      }
    }
    load();
  }, []);

  // CANCEL BOOKING
  const cancelBooking = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/cancel/${id}`,
        { method: "PUT" }
      );
      const data = await res.json();

      if (!data.success) return toast.error("Unable to cancel");

      toast.success("Booking cancelled");
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
    } catch {
      toast.error("Server error");
    }
  };

  // FILTER GROUPS
  const now = new Date();
  const upcoming = bookings.filter(
    (b) =>
      makeDateTime(b.date, b.timeSlot) >= now &&
      b.status !== "pending" &&
      b.status !== "cancelled"
  );

  const pending = bookings.filter((b) => b.status === "pending");

  const past = bookings.filter(
    (b) =>
      makeDateTime(b.date, b.timeSlot) < now || b.status === "cancelled"
  );

  // SHARE
  const shareBooking = (b) => {
    const text = `Join me at ${b.venueName} on ${b.date} at ${b.timeSlot}!`;
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  // STATUS BADGE
  const badge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="badge-status badge-green">
            <CheckCircle className="icon-xs" /> Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="badge-status badge-yellow">
            <AlertCircle className="icon-xs" /> Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="badge-status badge-red">
            <X className="icon-xs" /> Cancelled
          </Badge>
        );
    }
  };

  // BOOKING CARD
  const BookingCard = ({ b, showActions }) => (
    <Card className={`booking-card ${!showActions ? "past-card" : ""}`}>
      <div className="booking-card-row">
        <div className="booking-card-image">
          <img
            src={b.image}
            alt={b.venueName}
            className={!showActions ? "grayscale" : ""}
          />
        </div>

        <div className="booking-card-content">
          <div className="booking-header">
            <div>
              <h3 className="booking-title">{b.venueName}</h3>
              <div className="booking-location">
                <MapPin className="icon-sm" /> {b.location}
              </div>
              {badge(b.status)}
            </div>

            <div className="booking-price">
              <div className="price-amount">Rs {b.price}</div>
              <div className="price-hour">per hour</div>
            </div>
          </div>

          <div className="booking-details">
            <div className="detail-item">
              <Calendar className="icon-sm icon-blue" />
              {b.date}
            </div>

            <div className="detail-item">
              <Clock className="icon-sm icon-green" />
              {b.timeSlot}
            </div>

            <div className="detail-item">
              <TrendingUp className="icon-sm icon-purple" />
              {b.courtName}
            </div>
          </div>

          {/* ACTIONS ONLY FOR UPCOMING */}
          {showActions && (
            <div className="booking-actions">
              <Button variant="outline" onClick={() => shareBooking(b)}>
                <Share2 className="icon-sm" /> Share
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <X className="icon-sm" /> Cancel
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cancel booking at {b.venueName}?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => cancelBooking(b._id)}
                      className="btn-red"
                    >
                      Cancel Booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  // UI
  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <Button variant="ghost" onClick={onBack} className="header-back-btn">
          ← Back
        </Button>

        <div className="header-title-row">
          <Calendar className="icon-lg" />
          <h1 className="header-title">My Bookings</h1>
        </div>

        <p className="header-subtitle">
          Manage upcoming bookings & view history
        </p>
      </div>

      <div className="bookings-container">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="tabs-list">
            <TabsTrigger value="upcoming">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>

          {/* UPCOMING */}
          <TabsContent value="upcoming" className="tab-content">
            {upcoming.length === 0 ? (
              <Card>
                <CardContent className="empty-box">
                  <Calendar className="icon-xl empty-icon" />
                  <h3>No upcoming bookings</h3>
                  <Button onClick={onBack}>Browse Venues</Button>
                </CardContent>
              </Card>
            ) : (
              upcoming.map((b) => (
                <BookingCard key={b._id} b={b} showActions={true} />
              ))
            )}
          </TabsContent>

          {/* PENDING */}
          <TabsContent value="pending" className="tab-content">
            {pending.length === 0 ? (
              <Card>
                <CardContent className="empty-box">
                  <AlertCircle className="icon-xl empty-icon" />
                  <h3>No pending bookings</h3>
                </CardContent>
              </Card>
            ) : (
              pending.map((b) => (
                <BookingCard key={b._id} b={b} showActions={false} />
              ))
            )}
          </TabsContent>

          {/* PAST */}
          <TabsContent value="past" className="tab-content">
            {past.length === 0 ? (
              <Card>
                <CardContent className="empty-box">
                  <Clock className="icon-xl empty-icon" />
                  <h3>No past bookings</h3>
                </CardContent>
              </Card>
            ) : (
              past.map((b) => (
                <BookingCard key={b._id} b={b} showActions={false} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
