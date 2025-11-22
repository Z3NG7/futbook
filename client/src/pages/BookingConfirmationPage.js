
import { useLocation, useNavigate } from "react-router-dom";
import { BookingConfirmation } from "../components/BookingConfirmation.js";

export function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  if (!bookingData) {
    return (
      <main className="page-content">
        <div className="pt-4 text-center text-gray-500">
          No booking to show.
        </div>
      </main>
    );
  }

  return (
    <main className="page-content">
      <div className="pt-4">
        <BookingConfirmation
          bookingData={bookingData}
          onNewBooking={() => navigate("/")}
        />
      </div>
    </main>
  );
}