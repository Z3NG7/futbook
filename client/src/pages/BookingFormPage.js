import { BookingForm } from "../components/BookingForm.js";

import { useLocation, useNavigate } from "react-router-dom";


export function BookingFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { venue, turf, timeSlot, date } = location.state || {};

  if (!venue || !turf || !timeSlot || !date) {
    return (
      <main className="page-content">
        <div className="pt-4 text-center text-gray-500">
          No booking selected.
        </div>
      </main>
    );
  }

  const handleBookingConfirm = (bookingData) => {
    navigate("/booking-confirmation", { state: { bookingData } });
  };

  return (
    <main className="page-content">
      <div className="pt-4">
        <BookingForm
          venue={venue}
          turf={turf}
          timeSlot={timeSlot}
          date={date}
          onBack={() => navigate(-1)}
          onConfirm={handleBookingConfirm}
        />
      </div>
    </main>
  );
}