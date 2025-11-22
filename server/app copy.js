const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

/* ======================================================
   GLOBAL LOGGER MIDDLEWARE
===================================================== */
app.use((req, res, next) => {
  const start = Date.now();

  console.log("\n────────── 📥 NEW REQUEST ──────────");
  console.log("➡️", req.method, req.originalUrl);
  console.log("📦 Body:", req.body);
  console.log("🍪 Cookies:", req.cookies);

  const oldJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - start;
    console.log("\n────────── 📤 RESPONSE ──────────");
    console.log("⏱ Duration:", duration + "ms");
    console.log("📨 Data:", data);
    console.log("──────────────────────────────────\n");
    return oldJson.call(this, data);
  };

  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

/* ======================================================
   CONNECT MONGO
===================================================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB error:", err));

/* ======================================================
   MODELS
===================================================== */
const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    avatar: String,
    password: String,
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    delete ret.tokenVersion;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", UserSchema);

const CourtSchema = new mongoose.Schema(
  {
    courtId: String,
    name: String,
    type: String,
    pricePerHour: Number,
    timeSlots: [String],
  },
  { timestamps: true }
);

const VenueSchema = new mongoose.Schema(
  {
    name: String,
    city: String,
    location: String,
    rating: Number,
    pricePerHour: Number,
    image: String,
    sports: [String],
    openTime: String,
    closeTime: String,
    capacity: Number,
    turfs: Number,
    description: String,
    amenities: [String],
    courts: [CourtSchema],
  },
  { timestamps: true }
);

const Venue = mongoose.model("Venue", VenueSchema);

const BookingSchema = new mongoose.Schema(
  {
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
    courtId: String,
    date: String,
    timeSlot: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    paymentUUID: String,
    paymentStatus: { type: String, default: "PENDING" },

    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled", "completed", "lobby-active"],
      default: "confirmed",
    },

    maxPlayers: Number,
    playersJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);

/* ======================================================
   JWT HELPERS
===================================================== */
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

function createAccessToken(user) {
  return jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
}

function createRefreshToken(user) {
  return jwt.sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "2m" }
  );
}

function sendAuthCookies(res, access, refresh) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", access, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 60 * 1000,
  });

  res.cookie("refreshToken", refresh, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookies(res) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: new Date(0),
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: new Date(0),
  });
}

/* ======================================================
   AUTH MIDDLEWARE (ROUTE LEVEL ONLY)
===================================================== */
async function authRequired(req, res, next) {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

/* ======================================================
   PUBLIC ROUTES ONLY
===================================================== */

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.json({ success: false, message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      username,
      email,
      password: hashed,
    });

    const access = createAccessToken(user);
    const refresh = createRefreshToken(user);

    sendAuthCookies(res, access, refresh);

    res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    res.json({ success: false });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid login" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: "Invalid login" });

    const access = createAccessToken(user);
    const refresh = createRefreshToken(user);

    sendAuthCookies(res, access, refresh);

    res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    res.json({ success: false });
  }
});

// REFRESH
app.post("/api/auth/refresh", async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false });

    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.userId);

    if (!user || payload.tokenVersion !== user.tokenVersion) {
      clearAuthCookies(res);
      return res.status(401).json({ success: false });
    }

    const access = createAccessToken(user);
    const refresh = createRefreshToken(user);

    sendAuthCookies(res, access, refresh);

    res.json({ success: true });
  } catch (err) {
    clearAuthCookies(res);
    res.status(401).json({ success: false });
  }
});

// LOGOUT
app.post("/api/auth/logout", (req, res) => {
  clearAuthCookies(res);
  res.json({ success: true });
});

/* ======================================================
   PROTECTED ROUTES (OLD STYLE)
===================================================== */

// GET CURRENT USER
app.get("/api/auth/me", authRequired, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user: user.toJSON() });
});

// GET ALL VENUES
app.get("/api/venues",  async (req, res) => {
  const venues = await Venue.find();
  res.json({ success: true, data: venues });
});

// CREATE VENUE
app.post("/api/venues", authRequired, async (req, res) => {
  
  const venue = await Venue.create(req.body);
  res.json({ success: true, data: venue });
});

// BOOK SLOT
app.post("/api/bookings", authRequired, async (req, res) => {
  try {
    const { venueId, courtId, date, timeSlot } = req.body;

    const exists = await Booking.findOne({ venueId, courtId, date, timeSlot });
    if (exists) return res.json({ success: false, message: "Slot already booked" });

    const booking = await Booking.create({
      venueId,
      courtId,
      date,
      timeSlot,
      userId: req.user.id,
      status: "pending",
    });

    res.json({ success: true, data: booking });
  } catch {
    res.json({ success: false });
  }
});

// GET USER BOOKINGS
app.get("/api/bookings/user/:id", authRequired, async (req, res) => {
  if (req.params.id !== req.user.id) return res.status(403).json({ success: false });

  const bookings = await Booking.find({ userId: req.params.id }).populate("venueId");

  const formatted = bookings.map((b) => {
    const venue = b.venueId;
    const court = venue?.courts?.find((c) => c.courtId === b.courtId);

    return {
      _id: b._id,
      date: b.date,
      timeSlot: b.timeSlot,
      courtName: court?.name || b.courtId,
      venueName: venue?.name,
      location: venue?.location,
      image: venue?.image,
      price: court?.pricePerHour ?? venue?.pricePerHour ?? 0,
      status:
        b.status === "cancelled"
          ? "cancelled"
          : b.paymentStatus === "SUCCESS"
          ? "confirmed"
          : "pending",
    };
  });

  res.json({ success: true, data: formatted });
});

/* ======================================================
   SEARCH VENUES (AUTH REQUIRED)
   Example:
   GET /api/venues/search?query=a&city=All&minPrice=0&maxPrice=5000
===================================================== */
app.get("/api/venues/search",  async (req, res) => {
  try {
    const { query = "", city = "All", minPrice = 0, maxPrice = 999999 } = req.query;

    // Build Mongo filter
    const filter = {
      pricePerHour: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    };

    if (query.trim() !== "") {
      filter.name = { $regex: query, $options: "i" };
    }

    if (city !== "All" && city !== "All Locations") {
      filter.city = city;
    }

    const venues = await Venue.find(filter);

    res.json({ success: true, data: venues });
  } catch (err) {
    console.error("❌ Venue search error", err);
    res.status(500).json({ success: false });
  }
});


// MODIFY BOOKING
app.put("/api/bookings/modify/:id", authRequired, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false });

  if (booking.userId.toString() !== req.user.id) {
    return res.status(403).json({ success: false });
  }

  booking.status = "lobby-active";
  booking.maxPlayers = req.body.maxPlayers;
  booking.playersJoined = [booking.userId];

  await booking.save();

  res.json({ success: true, data: booking });
});

// CANCEL BOOKING
app.put("/api/bookings/cancel/:id", authRequired, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false });

  if (booking.userId.toString() !== req.user.id) {
    return res.status(403).json({ success: false });
  }

  booking.status = "cancelled";
  booking.paymentStatus = "FAILED";

  await booking.save();

  res.json({ success: true });
});

/* ======================================================
   START SERVER
===================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
