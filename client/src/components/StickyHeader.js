import "./StickyHeader.css";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input.js";
import { Button } from "./ui/button.js";
import {
  Search,
  Zap,
  Calendar,
  User,
  Menu,
  Trophy,
  Flame
} from "lucide-react";

export function StickyHeader({
  isVisible,
  searchQuery,
  onSearchChange,
  onBackToHome,
  onNavigateToBookings,
  onNavigateToProfile,
  onNavigateToFindGame,
  onNavigateToRewards
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          className="sticky-header"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <div className="sticky-container">
            <div className="sticky-row">

              {/* Logo */}
              <motion.div
                className="sticky-logo"
                onClick={onBackToHome}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="sticky-logo-icon"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Zap className="icon-white" />
                </motion.div>
                <h1 className="sticky-logo-text">FutBook</h1>
              </motion.div>

              {/* SEARCH BAR */}
              <motion.div
                className="sticky-search"
                animate={{ scale: isSearchFocused ? 1.02 : 1 }}
              >
                <motion.div
                  className="sticky-search-icon"
                  animate={{
                    rotate: isSearchFocused ? [0, 10, -10, 0] : 0,
                    scale: isSearchFocused ? [1, 1.1, 1] : 1
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isSearchFocused ? 3 : 0
                  }}
                >
                  <Search className="icon-gray" />
                </motion.div>

                <Input
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="sticky-search-input"
                />
              </motion.div>

              {/* MENU */}
              <div className="sticky-menu">

                {/* Desktop */}
                <div className="sticky-menu-desktop">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" onClick={onNavigateToFindGame} className="menu-btn">
                      <Trophy className="icon-sm" />
                      Find Game
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" onClick={onNavigateToBookings} className="menu-btn">
                      <Calendar className="icon-sm" />
                      My Bookings
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" onClick={onNavigateToRewards} className="menu-btn-orange">
                      <Flame className="icon-sm" />
                      Rewards
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" onClick={onNavigateToProfile} className="menu-btn">
                      <User className="icon-sm" />
                      Profile
                    </Button>
                  </motion.div>
                </div>

                {/* Mobile */}
                <div className="sticky-menu-mobile">
                  <Button size="sm" className="menu-btn">
                    <Menu className="icon-md" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Bottom Border */}
          <motion.div
            className="sticky-bottom-line"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </motion.header>
      )}
    </AnimatePresence>
  );
}
