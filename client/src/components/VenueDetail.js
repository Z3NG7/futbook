import "./VenueDetail.css";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./ui/card.js";
import { Button } from "./ui/button.js";
import { Badge } from "./ui/badge.js";
import { Separator } from "./ui/separator.js";

import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Users,
  Wifi,
  Car,
  Coffee,
  Calendar,
  CheckCircle2
} from "lucide-react";

import { ImageWithFallback } from "./figma/ImageWithFallback";

export function VenueDetail({ venue, onBack, onBookTurf }) {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [bookedSlots, setBookedSlots] = useState([]);

  // -------------------------------
  // FETCH BOOKED TIME SLOTS
  // -------------------------------
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedCourt || !selectedDate) return;

      console.log("📡 Fetching bookings for:");
      console.log("Venue:", venue._id);
      console.log("Court:", selectedCourt.courtId);
      console.log("Date:", selectedDate);

      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings?venueId=${venue._id}&courtId=${selectedCourt.courtId}&date=${selectedDate}`
        );

        const data = await res.json();
        console.log("📥 Bookings from DB:", data);

        if (data.success) {
          const alreadyBooked = data.data.map((b) => b.timeSlot);
          setBookedSlots(alreadyBooked);
          console.log("⛔ Booked slots:", alreadyBooked);
        }
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [selectedCourt, selectedDate, venue._id]);

  // -------------------------------
  const amenityIcons = {
    WiFi: Wifi,
    Parking: Car,
    Cafeteria: Coffee,
    "Changing Rooms": Users
  };

  const handleBooking = () => {
    if (!selectedCourt || !selectedTimeSlot || !selectedDate) return;
    onBookTurf(selectedCourt, selectedTimeSlot, selectedDate);
  };

  // -------------------------------

  return (
    <div className="venue-detail-container">

      {/* BACK BUTTON */}
      <Button onClick={onBack} variant="ghost" className="back-btn">
        <ArrowLeft className="icon-sm" /> Back to venues
      </Button>

      <div className="venue-detail-grid">

        {/* LEFT */}
        <div className="venue-left">

          {/* IMAGE */}
          <div className="venue-image-wrapper">
            <ImageWithFallback
              src={venue.image}
              alt={venue.name}
              className="venue-image"
            />
            <div className="venue-sport-tag">
              <Badge className="badge-green">{venue.sports[0]}</Badge>
            </div>
          </div>

          {/* VENUE INFO */}
          <Card className="venue-info-card">
            <CardContent>

              <div className="venue-header">
                <div>
                  <h1 className="venue-title">{venue.name}</h1>

                  <div className="venue-location">
                    <MapPin className="icon-sm" />
                    <span>{venue.location}</span>
                  </div>

                  <div className="venue-rating">
                    <Star className="icon-xs star-icon" />
                    <span className="rating-value">{venue.rating}</span>
                    <span className="rating-subtext">(124 reviews)</span>
                  </div>
                </div>

                <div className="venue-price-block">
                  <span className="venue-price">₹{venue.pricePerHour}</span>
                  <span className="price-sub">/hour</span>
                </div>
              </div>

              <p className="venue-description">
                {venue.description ||
                  "Premium sports facility with modern amenities and well-maintained courts."}
              </p>

              <div className="venue-stats-grid">
                <div className="venue-stat">
                  <Clock className="icon-sm gray-icon" />
                  <span>{venue.openTime} – {venue.closeTime}</span>
                </div>
                <div className="venue-stat">
                  <Users className="icon-sm gray-icon" />
                  <span>{venue.capacity} players max</span>
                </div>
              </div>

              <Separator />

              <h3 className="section-title">Amenities</h3>

              <div className="amenities-grid">
                {(venue.amenities || []).map((amenity) => {
                  const Icon = amenityIcons[amenity] || CheckCircle2;
                  return (
                    <div key={amenity} className="amenity-item">
                      <Icon className="icon-sm amenity-icon" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>

            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE – BOOKING */}
        <div className="venue-right">

          <Card className="booking-card">
            <CardHeader>
              <CardTitle className="booking-title">
                <Calendar className="icon-md" /> Book Your Slot
              </CardTitle>
            </CardHeader>

            <CardContent className="booking-content">

              {/* DATE */}
              <label className="label">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTimeSlot("");
                }}
                className="input-field"
              />

              {/* COURT */}
              <label className="label">Select Court</label>

              <div className="turf-list">
                {venue.courts.map((court) => (
                  <div
                    key={court.courtId}
                    className={`turf-item ${
                      selectedCourt?.courtId === court.courtId
                        ? "turf-selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedCourt(court);
                      setSelectedTimeSlot("");
                    }}
                  >
                    <div>
                      <h4 className="turf-name">{court.name}</h4>
                      <p className="turf-type">{court.type}</p>
                    </div>

                    <div className="turf-price-block">
                      <span className="turf-price">₹{court.pricePerHour}</span>
                      <span className="price-sub">/hour</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* TIME SLOTS */}
              {selectedCourt && (
                <>
                  <label className="label">Select Time Slot</label>

                  <div className="timeslot-grid">
                    {selectedCourt.timeSlots.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);

                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => !isBooked && setSelectedTimeSlot(slot)}
                          className={`timeslot-btn ${
                            isBooked
                              ? "slot-booked"
                              : selectedTimeSlot === slot
                              ? "slot-selected"
                              : ""
                          }`}
                        >
                          {slot}
                          {isBooked && (
                            <span className="slot-booked-text">Booked</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* SUMMARY */}
              {selectedCourt && selectedTimeSlot && (
                <div className="summary-box">
                  <h4 className="summary-title">Booking Summary</h4>

                  <div className="summary-row">
                    <span>Court:</span>
                    <span>{selectedCourt.name}</span>
                  </div>

                  <div className="summary-row">
                    <span>Date:</span>
                    <span>{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>

                  <div className="summary-row">
                    <span>Time:</span>
                    <span>{selectedTimeSlot}</span>
                  </div>

                  <Separator />

                  <div className="summary-row total-row">
                    <span>Total:</span>
                    <span className="total-price">
                      ₹{selectedCourt.pricePerHour}
                    </span>
                  </div>
                </div>
              )}

              {/* CONFIRM */}
              <Button
                disabled={!selectedCourt || !selectedTimeSlot}
                className="confirm-btn"
                onClick={handleBooking}
              >
                Proceed to Book
              </Button>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
