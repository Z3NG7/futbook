import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Button } from "./ui/button.js";
import { Input } from "./ui/input.js";
import { Label } from "./ui/label.js";
import { Separator } from "./ui/separator.js";
import { ArrowLeft, User } from "lucide-react";
import "./BookingForm.css";

export function BookingForm({ venue, turf, timeSlot, date, onBack }) {
  const [formData, setFormData] = useState({
    playerName: "",
    email: "",
    phone: "",
    teamName: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.playerName && formData.email && formData.phone;

  // -------------------------------------
  // HANDLE ESEWA PAYMENT
  // -------------------------------------
const handleEsewaPay = async () => {
  if (!isFormValid) return;

  setIsProcessing(true);

  const amount = turf.pricePerHour;

  // USER ID — temporary hard-coded or use your auth system
  const userId = "TEMP_USER_001";

  const response = await fetch("http://localhost:5000/api/payment/esewa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      venueId: venue._id,
      courtId: turf.courtId,         // ensure turf.courtId exists
      date,
      timeSlot,
      userId
    }),
  });

  const data = await response.json();

  console.log("📥 eSewa API Response:", data);

  if (!data.success) {
    alert("eSewa payment error. Try again.");
    setIsProcessing(false);
    return;
  }

  // Auto-submit form to eSewa
  const form = document.createElement("form");
  form.method = "POST";
  form.action = data.esewaUrl;

  Object.entries(data.form).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

  // -------------------------------------

  return (
    <div className="bf-wrapper">

      <Button variant="ghost" onClick={onBack} className="bf-back-btn">
        <ArrowLeft className="bf-back-icon" />
        Back to venue
      </Button>

      <div className="bf-grid">

        {/* Summary */}
        <Card className="bf-summary-card">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>

          <CardContent className="bf-summary-content">
            <div className="bf-summary-box">
              <h3 className="bf-summary-venue">{venue.name}</h3>

              <div className="bf-summary-rows">

                <div className="bf-row">
                  <span>Location:</span>
                  <span>{venue.location}</span>
                </div>

                <div className="bf-row">
                  <span>Court:</span>
                  <span>{turf.name} ({turf.type})</span>
                </div>

                <div className="bf-row">
                  <span>Date:</span>
                  <span>
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="bf-row">
                  <span>Time:</span>
                  <span>{timeSlot}</span>
                </div>

                <div className="bf-row">
                  <span>Duration:</span>
                  <span>1 hour</span>
                </div>

                <Separator />

                <div className="bf-total-row">
                  <span>Total Amount:</span>
                  <span className="bf-total-amount">₹{turf.pricePerHour}</span>
                </div>

              </div>
            </div>

            <div className="bf-info-list">
              <p>• Booking confirmation will be sent to your email</p>
              <p>• Cancellation allowed up to 2 hours before booking</p>
              <p>• Please arrive 15 minutes early</p>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card className="bf-form-card">
          <CardHeader>
            <CardTitle>Complete Your Booking</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="bf-form">

              {/* Player Details */}
              <div className="bf-section">
                <h3 className="bf-section-title">
                  <User className="bf-section-icon" />
                  Player Details
                </h3>

                <div>
                  <Label htmlFor="playerName">Player Name *</Label>
                  <Input
                    id="playerName"
                    value={formData.playerName}
                    onChange={(e) => handleInputChange("playerName", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="teamName">Team Name (Optional)</Label>
                  <Input
                    id="teamName"
                    value={formData.teamName}
                    onChange={(e) => handleInputChange("teamName", e.target.value)}
                    placeholder="Enter team name"
                  />
                </div>
              </div>

              <Separator />

              {/* eSewa Pay */}
              <div className="bf-section">
                <h3 className="bf-section-title">
                  <img
                    src="https://esewa.com.np/common/images/esewa_logo.png"
                    alt="eSewa"
                    style={{ width: "90px", marginRight: "8px" }}
                  />
                  Pay with eSewa
                </h3>

                <Button
                  type="button"
                  disabled={!isFormValid || isProcessing}
                  className="bf-confirm-btn"
                  onClick={handleEsewaPay}
                >
                  {isProcessing ? (
                    <div className="bf-spinner-wrapper">
                      <div className="bf-spinner"></div>
                      Redirecting to eSewa...
                    </div>
                  ) : (
                    <>Pay with eSewa – ₹{turf.pricePerHour}</>
                  )}
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
