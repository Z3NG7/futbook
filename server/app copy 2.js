// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

/* ======================================================
   CORE MIDDLEWARE
===================================================== */
app.use(
  cors({
    origin: "http://localhost:3000", // your React app
    credentials: true,               // allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

/* ======================================================
   DB CONNECT
===================================================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB error:", err));

/* ======================================================
   JWT CONFIG  (ONE PLACE TO TWEAK EXPIRY)
===================================================== */
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "dev_access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "dev_refresh_secret";

// 🔥 Change token lifetimes ONLY here:
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "1m"; // e.g. "15m", "1h"
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "2m"; // e.g. "7d", "30d"

function generateAccessToken(userId) {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

/* ======================================================
   COMMON TIMESTAMP OPTIONS
===================================================== */
const timestampOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

/* ======================================================
   USER MODEL
===================================================== */
const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    avatar: String,
    password: String, // hashed with bcrypt
    refreshToken: String, // hashed refresh token (optional, for logout/invalidation)
  },
  timestampOptions
);

const User = mongoose.model("User", UserSchema);

/* ======================================================
   VENUE + COURT MODELS
===================================================== */
const CourtSchema = new mongoose.Schema(
  {
    courtId: String,
    name: String,
    type: String,
    pricePerHour: Number,
    timeSlots: [String],
  },
  timestampOptions
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
  timestampOptions
);

const Venue = mongoose.model("Venue", VenueSchema);

/* ======================================================
   BOOKING MODEL
===================================================== */
const BookingSchema = new mongoose.Schema(
  {
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
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

    maxPlayers: { type: Number, default: 0 },
    playersJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  timestampOptions
);

const Booking = mongoose.model("Booking", BookingSchema);

/* ======================================================
   AUTH MIDDLEWARE (for protected API routes)
===================================================== */
function authRequired(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}

/* ======================================================
   AUTH ROUTES
===================================================== */

/* ======================================================
   GET CURRENT USER  (REQUIRED BY FRONTEND)
===================================================== */
app.get("/api/auth/me", async (req, res) => {
  try {
    const token = req.cookies.accessToken;  // ALWAYS read cookie only

    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: user.toJSON() });

  } catch (err) {
    console.log("❌ /me error:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
});


// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email already used" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      username,
      email,
      password: hashed,
    });

    // No token on register to keep it simple (can auto-login if you want)
    res.json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.json({ success: false, message: "Register failed" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.json({ success: false, message: "Invalid email or password" });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store hashed refresh token in DB (optional, but safer)
    const hashedRT = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRT;
    await user.save();

    // Set refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on HTTPS
      sameSite: "lax",
      path: "/api/auth/refresh", // only sent to this endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms (keep in sync with REFRESH_TOKEN_EXPIRES_IN)
    });

    res.json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.json({ success: false, message: "Login failed" });
  }
});

// REFRESH ACCESS TOKEN
app.post("/api/auth/refresh", async (req, res) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;
    if (!tokenFromCookie) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });
    }

    let payload;
    try {
      payload = jwt.verify(tokenFromCookie, REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(payload.userId);
    if (!user || !user.refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token not valid" });
    }

    // Compare stored hashed refresh token with cookie token
    const match = await bcrypt.compare(tokenFromCookie, user.refreshToken);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token mismatch" });
    }

    // All good → issue new access token
    const newAccessToken = generateAccessToken(user._id);
    res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    console.error("REFRESH ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// LOGOUT
app.post("/api/auth/logout", async (req, res) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;

    if (tokenFromCookie) {
      // try decode to find user
      try {
        const payload = jwt.verify(tokenFromCookie, REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.userId);
        if (user) {
          user.refreshToken = null;
          await user.save();
        }
      } catch {
        // ignore errors here
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/refresh",
    });

    res.json({ success: true, message: "Logged out" });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ======================================================
   VENUE ROUTES  (home & list are PUBLIC)
===================================================== */
app.get("/", (req, res) => res.send("Futbook API OK"));

// Public: get all venues (home page, etc.)
app.get("/api/venues", async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json({ success: true, data: venues });
  } catch (err) {
    console.error("GET VENUES ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// You might protect these later with authRequired if only admins should use them
app.post("/api/venues", async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.json({ success: true, data: venue });
  } catch (err) {
    console.error("CREATE VENUE ERROR:", err);
    res.status(400).json({ success: false, message: "Create failed" });
  }
});

app.put("/api/venues/:id", async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: venue });
  } catch (err) {
    console.error("UPDATE VENUE ERROR:", err);
    res.status(400).json({ success: false, message: "Update failed" });
  }
});

app.delete("/api/venues/:id", async (req, res) => {
  try {
    const deleted = await Venue.findByIdAndDelete(req.params.id);
    res.json({ success: true, deleted });
  } catch (err) {
    console.error("DELETE VENUE ERROR:", err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

/* ======================================================
   BOOKING ROUTES
===================================================== */

// Create booking  (protected)
app.post("/api/bookings", authRequired, async (req, res) => {
  try {
    const userId = req.userId; // from access token
    const { venueId, courtId, date, timeSlot } = req.body;

    const exists = await Booking.findOne({ venueId, courtId, date, timeSlot });
    if (exists) {
      return res.json({ success: false, message: "Slot already booked" });
    }

    const booking = await Booking.create({
      venueId,
      courtId,
      date,
      timeSlot,
      userId,
      status: "pending",
      paymentStatus: "PENDING",
    });

    res.json({ success: true, data: booking });
  } catch (err) {
    console.error("CREATE BOOKING ERROR:", err);
    res.json({ success: false, message: "Booking failed" });
  }
});

// Get bookings for user (protected)
app.get("/api/bookings/user/:id", authRequired, async (req, res) => {
  try {
    const userId = req.params.id;

    // Optional: ensure user can only see own bookings
    if (userId !== String(req.userId)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: not your bookings" });
    }

    const bookings = await Booking.find({ userId }).populate("venueId");

    const formatted = bookings.map((b) => {
      const venue = b.venueId;
      const court = venue?.courts?.find((c) => c.courtId === b.courtId);
      const price = court?.pricePerHour ?? venue?.pricePerHour ?? 0;

      return {
        _id: b._id,
        date: b.date,
        timeSlot: b.timeSlot,
        courtName: court?.name || b.courtId,
        venueName: venue?.name,
        location: venue?.location,
        image: venue?.image,
        price,
        status:
          b.status === "cancelled"
            ? "cancelled"
            : b.paymentStatus === "SUCCESS"
            ? "confirmed"
            : "pending",
        created_at: b.created_at,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error("GET USER BOOKINGS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Modify booking → Activate lobby (protected)
app.put("/api/bookings/modify/:id", authRequired, async (req, res) => {
  try {
    const { maxPlayers } = req.body;

    if (!maxPlayers || maxPlayers < 2) {
      return res.json({ success: false, message: "Invalid count" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // optional: prevent others editing your booking
    if (String(booking.userId) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    booking.status = "lobby-active";
    booking.maxPlayers = maxPlayers;
    booking.playersJoined = [booking.userId];

    await booking.save();

    res.json({ success: true, data: booking });
  } catch (err) {
    console.error("MODIFY BOOKING ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Cancel booking (protected)
app.put("/api/bookings/cancel/:id", authRequired, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (String(booking.userId) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    booking.status = "cancelled";
    booking.paymentStatus = "FAILED";
    await booking.save();

    res.json({ success: true });
  } catch (err) {
    console.error("CANCEL BOOKING ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ======================================================
   ESEWA PAYMENT
===================================================== */
const ESEWA_MERCHANT_CODE = "EPAYTEST";
const ESEWA_SECRET_KEY = "8gBm/:&EnhH.1/q";
const ESEWA_BASE_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

const SUCCESS_URL = "http://localhost:5000/api/payment/esewa/success";
const FAILURE_URL = "http://localhost:5000/api/payment/esewa/fail";

const pendingPayments = {};

function generateUUID() {
  return "TXN_" + Date.now();
}

// INIT PAYMENT (protected, because it creates booking later)
app.post("/api/payment/esewa", authRequired, async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, venueId, courtId, date, timeSlot } = req.body;

    const transaction_uuid = generateUUID();

    pendingPayments[transaction_uuid] = {
      venueId,
      courtId,
      date,
      timeSlot,
      userId,
    };

    const total_amount = Number(amount);

    const signature_string = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${ESEWA_MERCHANT_CODE}`;

    const signature = crypto
      .createHmac("sha256", ESEWA_SECRET_KEY)
      .update(signature_string)
      .digest("base64");

    res.json({
      success: true,
      esewaUrl: ESEWA_BASE_URL,
      form: {
        amount,
        total_amount,
        transaction_uuid,
        product_code: ESEWA_MERCHANT_CODE,
        success_url: SUCCESS_URL,
        failure_url: FAILURE_URL,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  } catch (err) {
    console.error("INIT PAYMENT ERROR:", err);
    res.status(500).json({ success: false, message: "Payment init failed" });
  }
});

// PAYMENT SUCCESS
app.get("/api/payment/esewa/success", async (req, res) => {
  try {
    const decoded = JSON.parse(
      Buffer.from(req.query.data, "base64").toString()
    );

    const { transaction_uuid, total_amount } = decoded;

    const verifyURL =
      `https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=${ESEWA_MERCHANT_CODE}` +
      `&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

    const verify = await (await fetch(verifyURL)).json();

    if (verify.status === "COMPLETE") {
      const info = pendingPayments[transaction_uuid];

      if (info) {
        await Booking.create({
          ...info,
          paymentUUID: transaction_uuid,
          paymentStatus: "SUCCESS",
          status: "confirmed",
        });

        delete pendingPayments[transaction_uuid];
      }

      return res.redirect("http://localhost:5173/payment-success");
    }

    return res.redirect("http://localhost:5173/payment-failed");
  } catch (err) {
    console.error("PAYMENT SUCCESS HANDLER ERROR:", err);
    return res.redirect("http://localhost:5173/payment-failed");
  }
});

/* ======================================================
   START SERVER
===================================================== */
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
