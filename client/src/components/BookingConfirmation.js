import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Button } from "./ui/button.js";
import { Separator } from "./ui/separator.js";
import {
  CheckCircle,
  Download,
  Calendar,
  MapPin,
  Clock,
  User,
} from "lucide-react";
import "./BookingConfirmation.css";

export function BookingConfirmation({ bookingData, onNewBooking }) {
  const handleDownload = () => {
    alert("Receipt download functionality would be implemented here");
  };

  return (
    <div className="bc-wrapper">
      <Card className="bc-card">

        <CardHeader className="bc-header">
          <div className="bc-icon-wrapper">
            <div className="bc-icon-circle">
              <CheckCircle className="bc-check-icon" />
            </div>
          </div>

          <CardTitle className="bc-title">
            Booking Confirmed!
          </CardTitle>

          <p className="bc-subtext">
            Your sports venue has been successfully booked
          </p>
        </CardHeader>

        <CardContent className="bc-content">

          {/* Booking ID */}
          <div className="bc-box">
            <p className="bc-label">Booking ID</p>
            <p className="bc-id">{bookingData.bookingId}</p>
          </div>

          {/* Booking Details */}
          <div className="bc-section">
            <h3 className="bc-section-title">Booking Details</h3>

            <div className="bc-details-grid">

              <div className="bc-detail-item">
                <MapPin className="bc-detail-icon" />
                <div>
                  <p className="bc-detail-main">{bookingData.venue}</p>
                  <p className="bc-detail-sub">{bookingData.turf}</p>
                </div>
              </div>

              <div className="bc-detail-item">
                <Calendar className="bc-detail-icon" />
                <p className="bc-detail-main">
                  {new Date(bookingData.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="bc-detail-item">
                <Clock className="bc-detail-icon" />
                <div>
                  <p className="bc-detail-main">{bookingData.timeSlot}</p>
                  <p className="bc-detail-sub">1 hour duration</p>
                </div>
              </div>

              <div className="bc-detail-item">
                <User className="bc-detail-icon" />
                <div>
                  <p className="bc-detail-main">{bookingData.playerName}</p>
                  <p className="bc-detail-sub">{bookingData.email}</p>
                </div>
              </div>

            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="bc-section">
            <h3 className="bc-section-title">Payment Summary</h3>

            <div className="bc-row">
              <span>Booking Amount</span>
              <span>₹{bookingData.amount}</span>
            </div>

            <div className="bc-row">
              <span>Taxes & Fees</span>
              <span>₹0</span>
            </div>

            <Separator />

            <div className="bc-row bc-total">
              <span>Total Paid</span>
              <span className="bc-total-amount">₹{bookingData.amount}</span>
            </div>
          </div>

          <Separator />

          {/* Important Info */}
          <div className="bc-important">
            <h4>Important Information</h4>
            <ul>
              <li>• Please arrive 15 minutes before your booking time</li>
              <li>• Bring valid ID proof for verification</li>
              <li>• Cancellation allowed up to 2 hours before booking</li>
              <li>• Contact venue directly for any queries</li>
            </ul>
          </div>

          {/* Confirmation Notice */}
          <div className="bc-email-box">
            <p>
              📧 Booking confirmation sent to{" "}
              <strong>{bookingData.email}</strong>
            </p>
          </div>

          {/* Buttons */}
          <div className="bc-buttons">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="bc-btn-outline"
            >
              <Download className="bc-btn-icon" />
              Download Receipt
            </Button>

            <Button
              onClick={onNewBooking}
              className="bc-btn-primary"
            >
              Book Another Venue
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
