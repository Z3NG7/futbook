import {useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { VenueDetail } from "../components/VenueDetail.js";

export function VenueDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(location.state?.venue || null);

  if (!venue) {
    return (
      <main className="page-content">
        <div className="pt-4 text-center text-gray-500">Loading venue...</div>
      </main>
    );
  }

  const handleBookTurf = (turf, timeSlot, date) => {
    navigate(`/venues/${venue._id}/book`, {
      state: { venue, turf, timeSlot, date },
    });
  };

  return (
    <main className="page-content">
      <div className="pt-4">
        <VenueDetail
          venue={venue}
          onBack={() => navigate("/")}
          onBookTurf={handleBookTurf}
        />
      </div>
    </main>
  );
}
