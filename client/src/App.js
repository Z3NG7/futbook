// src/App.js
import { useEffect, useState } from "react";
import { Routes, Route, Outlet, useNavigate} from "react-router-dom";

import { Toaster } from "./components/ui/sonner.js";


import { StickyHeader } from "./components/StickyHeader.js";



import { ProtectedRoute } from "./components/ProtectedRoute";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { BookingFormPage } from "./pages/BookingFormPage";
import { VenueDetailPage } from "./pages/VenueDetailPage.js";
import { BookingConfirmationPage } from "./pages/BookingConfirmationPage.js";

import { UpcomingBookingsPage } from "./pages/UpcomingBookingsPage.js";
import { PlayerProfilePage } from "./pages/PlayerProfilePage.js";
import { FindGamePage } from "./pages/FindGamePage.js";
import { LoyaltyRewardsPage } from "./pages/LoyaltyRewardsPage.js";


import "./App.css";



// ---------------------------------------------------
// 1) APP LAYOUT (StickyHeader wrapper)
// ---------------------------------------------------
function AppLayout() {
  const [showStickyHeader, setShowStickyHeader] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setShowStickyHeader(true);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app-container">
      <StickyHeader
        isVisible={showStickyHeader}
        onBackToHome={() => navigate("/")}
        onNavigateToBookings={() => navigate("/bookings")}
        onNavigateToProfile={() => navigate("/profile")}
        onNavigateToFindGame={() => navigate("/find-game")}
        onNavigateToRewards={() => navigate("/rewards")}
      />
      <Outlet />
    </div>
  );
}




// ---------------------------------------------------
// 3) OTHER PAGES (unchanged)
// ---------------------------------------------------












// ---------------------------------------------------
// 4) MAIN ROUTER
// ---------------------------------------------------
export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/venues/:venueId" element={<VenueDetailPage />} />
            <Route path="/venues/:venueId/book" element={<BookingFormPage />} />
            <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
            <Route path="/bookings" element={<UpcomingBookingsPage />} />
            <Route path="/profile" element={<PlayerProfilePage />} />
            <Route path="/find-game" element={<FindGamePage />} />
            <Route path="/rewards" element={<LoyaltyRewardsPage />} />
          </Route>
        </Route>

        {/* CATCH-ALL → HOME */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}
