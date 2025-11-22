import { useLocation, useNavigate } from "react-router-dom";
import { UpcomingBookings } from "../components/UpcomingBookings.js";

export function UpcomingBookingsPage() {
  const navigate = useNavigate();
  return (
    <main className="page-content">
      <div className="pt-4">
        <UpcomingBookings onBack={() => navigate("/")} />
      </div>
    </main>
  );
}
