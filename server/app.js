// // server.js (or index.js)
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
// const crypto = require("crypto");
// require("dotenv").config();

// const app = express();

// /* ======================================================
//    GLOBAL CONFIG – TWEAK TOKEN TIMES HERE ONLY
// ====================================================== */
// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
// const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// // For JWT payload
// const ACCESS_TOKEN_EXPIRES_IN = "1m";   // JWT  access token life
// const REFRESH_TOKEN_EXPIRES_IN = "10m";  // JWT  refresh token life

// // For cookies
// const ACCESS_TOKEN_COOKIE_MS = 60 * 1000;       // 1 minute
// const REFRESH_TOKEN_COOKIE_MS = 10 * 60 * 1000;  // 2 minutes

// /* ======================================================
//    CORE MIDDLEWARE
// ====================================================== */
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(cookieParser());

// /* ======================================================
//    GLOBAL LOGGER (AFTER cookieParser SO COOKIES SHOW)
// ====================================================== */
// app.use((req, res, next) => {
//   const start = Date.now();

//   console.log("\n────────── 📥 NEW REQUEST ──────────");
//   console.log("🕒 Time:", new Date().toISOString());
//   console.log("➡️", req.method, req.originalUrl);
//   console.log("📦 Body:", req.body);
//   console.log("❓ Query:", req.query);
//   console.log("🍪 Cookies:", req.cookies);

//   const oldJson = res.json.bind(res);
//   res.json = (data) => {
//     const duration = Date.now() - start;
//     console.log("\n────────── 📤 RESPONSE ──────────");
//     console.log("⏱ Duration:", duration + "ms");
//     console.log("🔢 Status:", res.statusCode);
//     console.log("📨 Data:", data);
//     console.log("──────────────────────────────────\n");
//     return oldJson(data);
//   };

//   next();
// });

// /* ======================================================
//    CONNECT MONGO
// ====================================================== */
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.log("❌ DB error:", err));

// /* ======================================================
//    MODELS
// ====================================================== */
// const UserSchema = new mongoose.Schema(
//   {
//     fullName: String,
//     username: { type: String, unique: true },
//     email: { type: String, unique: true },
//     avatar: String,
//     password: String,
//     tokenVersion: { type: Number, default: 0 }, // for refresh invalidation
//   },
//   { timestamps: true }
// );

// UserSchema.set("toJSON", {
//   transform(doc, ret) {
//     delete ret.password;
//     delete ret.tokenVersion;
//     delete ret.__v;
//     return ret;
//   },
// });

// const User = mongoose.model("User", UserSchema);

// const CourtSchema = new mongoose.Schema(
//   {
//     courtId: String,
//     name: String,
//     type: String,
//     pricePerHour: Number,
//     timeSlots: [String],
//   },
//   { timestamps: true }
// );

// const VenueSchema = new mongoose.Schema(
//   {
//     name: String,
//     city: String,
//     location: String,
//     rating: Number,
//     pricePerHour: Number,
//     image: String,
//     sports: [String],
//     openTime: String,
//     closeTime: String,
//     capacity: Number,
//     turfs: Number,
//     description: String,
//     amenities: [String],
//     courts: [CourtSchema],
//   },
//   { timestamps: true }
// );

// const Venue = mongoose.model("Venue", VenueSchema);

// const BookingSchema = new mongoose.Schema(
//   {
//     venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
//     courtId: String,
//     date: String,
//     timeSlot: String,
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     paymentUUID: String,
//     paymentStatus: { type: String, default: "PENDING" },

//     status: {
//       type: String,
//       enum: ["confirmed", "pending", "cancelled", "completed", "lobby-active"],
//       default: "confirmed",
//     },

//     maxPlayers: Number,
//     playersJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   },
//   { timestamps: true }
// );

// const Booking = mongoose.model("Booking", BookingSchema);

// /* ======================================================
//    JWT HELPERS
// ====================================================== */
// function createAccessToken(user) {
//   return jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
//     expiresIn: ACCESS_TOKEN_EXPIRES_IN,
//   });
// }

// function createRefreshToken(user) {
//   return jwt.sign(
//     { userId: user._id, tokenVersion: user.tokenVersion },
//     REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: REFRESH_TOKEN_EXPIRES_IN,
//     }
//   );
// }

// function sendAuthCookies(res, access, refresh) {
//   const isProd = process.env.NODE_ENV === "production";

//   res.cookie("accessToken", access, {
//     httpOnly: true,
//     secure: isProd,
//     sameSite: isProd ? "none" : "lax",
//     maxAge: ACCESS_TOKEN_COOKIE_MS,
//   });

//   res.cookie("refreshToken", refresh, {
//     httpOnly: true,
//     secure: isProd,
//     sameSite: isProd ? "none" : "lax",
//     maxAge: REFRESH_TOKEN_COOKIE_MS,
//   });
// }

// function clearAuthCookies(res) {
//   const isProd = process.env.NODE_ENV === "production";

//   res.cookie("accessToken", "", {
//     httpOnly: true,
//     secure: isProd,
//     sameSite: isProd ? "none" : "lax",
//     expires: new Date(0),
//   });

//   res.cookie("refreshToken", "", {
//     httpOnly: true,
//     secure: isProd,
//     sameSite: isProd ? "none" : "lax",
//     expires: new Date(0),
//   });
// }

// /* ======================================================
//    AUTH MIDDLEWARE (FOR PROTECTED ROUTES)
// ====================================================== */
// async function authRequired(req, res, next) {
//   try {
//     const token =
//       req.cookies.accessToken ||
//       (req.headers.authorization?.startsWith("Bearer ")
//         ? req.headers.authorization.split(" ")[1]
//         : null);

//     if (!token) {
//       return res.status(401).json({ success: false, message: "Not authenticated" });
//     }

//     const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
//     req.user = { id: payload.userId };
//     next();
//   } catch (err) {
//     console.log("❌ authRequired error:", err.message);
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid or expired token" });
//   }
// }

// /* ======================================================
//    PUBLIC AUTH ROUTES
// ====================================================== */

// // REGISTER
// app.post("/api/auth/register", async (req, res) => {
//   try {
//     const { fullName, username, email, password } = req.body;

//     const exists = await User.findOne({ email });
//     if (exists) {
//       return res.json({ success: false, message: "Email already used" });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       fullName,
//       username,
//       email,
//       password: hashed,
//     });

//     const access = createAccessToken(user);
//     const refresh = createRefreshToken(user);

//     sendAuthCookies(res, access, refresh);

//     res.json({ success: true, user: user.toJSON() });
//   } catch (err) {
//     console.error("❌ Register error:", err);
//     res.json({ success: false, message: "Registration failed" });
//   }
// });

// // LOGIN
// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.json({ success: false, message: "Invalid login" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.json({ success: false, message: "Invalid login" });

//     const access = createAccessToken(user);
//     const refresh = createRefreshToken(user);

//     sendAuthCookies(res, access, refresh);

//     res.json({ success: true, user: user.toJSON() });
//   } catch (err) {
//     console.error("❌ Login error:", err);
//     res.json({ success: false, message: "Login failed" });
//   }
// });

// // REFRESH
// app.post("/api/auth/refresh", async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;
//     if (!token) return res.status(401).json({ success: false });

//     const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
//     const user = await User.findById(payload.userId);

//     if (!user || payload.tokenVersion !== user.tokenVersion) {
//       clearAuthCookies(res);
//       return res.status(401).json({ success: false });
//     }

//     const access = createAccessToken(user);
//     const refresh = createRefreshToken(user);

//     sendAuthCookies(res, access, refresh);

//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ Refresh error:", err.message);
//     clearAuthCookies(res);
//     res.status(401).json({ success: false });
//   }
// });

// // LOGOUT
// app.post("/api/auth/logout", (req, res) => {
//   clearAuthCookies(res);
//   res.json({ success: true });
// });

// /* ======================================================
//    GET CURRENT USER  (USED BY AuthContext)
// ====================================================== */
// app.get("/api/auth/me", authRequired, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.json({ success: true, user: user.toJSON() });
//   } catch (err) {
//     console.error("❌ /api/auth/me error:", err);
//     res.status(500).json({ success: false });
//   }
// });

// /* ======================================================
//    VENUE ROUTES
// ====================================================== */

// // GET ALL VENUES (public)
// app.get("/api/venues", async (req, res) => {
//   const venues = await Venue.find();
//   res.json({ success: true, data: venues });
// });

// // CREATE VENUE (protected)
// app.post("/api/venues", authRequired, async (req, res) => {
//   const venue = await Venue.create(req.body);
//   res.json({ success: true, data: venue });
// });

// // SEARCH VENUES (public)
// // Example: /api/venues/search?query=a&city=All+Locations&minPrice=0&maxPrice=5000
// app.get("/api/venues/search", async (req, res) => {
//   try {
//     const { query = "", city = "All", minPrice = 0, maxPrice = 999999 } = req.query;

//     const filter = {
//       pricePerHour: { $gte: Number(minPrice), $lte: Number(maxPrice) },
//     };

//     if (query.trim() !== "") {
//       filter.name = { $regex: query, $options: "i" };
//     }

//     if (city !== "All" && city !== "All Locations") {
//       filter.city = city;
//     }

//     const venues = await Venue.find(filter);
//     res.json({ success: true, data: venues });
//   } catch (err) {
//     console.error("❌ Venue search error:", err);
//     res.status(500).json({ success: false });
//   }
// });

// /* ======================================================
//    BOOKINGS ROUTES (PROTECTED)
// ====================================================== */

// // BOOK SLOT
// app.post("/api/bookings", authRequired, async (req, res) => {
//   try {
//     const { venueId, courtId, date, timeSlot } = req.body;

//     const exists = await Booking.findOne({ venueId, courtId, date, timeSlot });
//     if (exists) {
//       return res.json({ success: false, message: "Slot already booked" });
//     }

//     const booking = await Booking.create({
//       venueId,
//       courtId,
//       date,
//       timeSlot,
//       userId: req.user.id,
//       status: "pending",
//     });

//     res.json({ success: true, data: booking });
//   } catch (err) {
//     console.error("❌ Booking error:", err);
//     res.json({ success: false });
//   }
// });

// // GET USER BOOKINGS
// app.get("/api/bookings/user/:id", authRequired, async (req, res) => {
//   if (req.params.id !== req.user.id) {
//     return res.status(403).json({ success: false });
//   }

//   const bookings = await Booking.find({ userId: req.params.id }).populate("venueId");

//   const formatted = bookings.map((b) => {
//     const venue = b.venueId;
//     const court = venue?.courts?.find((c) => c.courtId === b.courtId);

//     return {
//       _id: b._id,
//       date: b.date,
//       timeSlot: b.timeSlot,
//       courtName: court?.name || b.courtId,
//       venueName: venue?.name,
//       location: venue?.location,
//       image: venue?.image,
//       price: court?.pricePerHour ?? venue?.pricePerHour ?? 0,
//       status:
//         b.status === "cancelled"
//           ? "cancelled"
//           : b.paymentStatus === "SUCCESS"
//           ? "confirmed"
//           : "pending",
//     };
//   });

//   res.json({ success: true, data: formatted });
// });

// // MODIFY BOOKING (LOBBY ACTIVE)
// app.put("/api/bookings/modify/:id", authRequired, async (req, res) => {
//   const booking = await Booking.findById(req.params.id);
//   if (!booking) return res.status(404).json({ success: false });

//   if (booking.userId.toString() !== req.user.id) {
//     return res.status(403).json({ success: false });
//   }

//   booking.status = "lobby-active";
//   booking.maxPlayers = req.body.maxPlayers;
//   booking.playersJoined = [booking.userId];

//   await booking.save();

//   res.json({ success: true, data: booking });
// });

// // CANCEL BOOKING
// app.put("/api/bookings/cancel/:id", authRequired, async (req, res) => {
//   const booking = await Booking.findById(req.params.id);
//   if (!booking) return res.status(404).json({ success: false });

//   if (booking.userId.toString() !== req.user.id) {
//     return res.status(403).json({ success: false });
//   }

//   booking.status = "cancelled";
//   booking.paymentStatus = "FAILED";

//   await booking.save();

//   res.json({ success: true });
// });

// /* ======================================================
//    ESEWA PAYMENT ROUTES (PLACEHOLDER – FILL YOUR LOGIC)
// ====================================================== */

// // // INITIATE ESEWA PAYMENT
// // app.post("/api/payments/esewa/initiate", authRequired, async (req, res) => {
// //   // TODO: replace with real eSewa payload & redirect URL logic
// //   console.log("💰 eSewa initiate payload:", req.body);
// //   return res.json({ success: true, message: "eSewa initiate placeholder" });
// // });

// // // ESEWA CALLBACK (for success/failure redirect)
// // app.get("/api/payments/esewa/callback", async (req, res) => {
// //   console.log("💰 eSewa callback query:", req.query);
// //   // TODO: verify transaction, update Booking/paymentStatus etc.
// //   res.send("eSewa callback received");
// // });

// // // VERIFY ESEWA PAYMENT
// // app.post("/api/payments/esewa/verify", authRequired, async (req, res) => {
// //   console.log("💰 eSewa verify payload:", req.body);
// //   // TODO: implement verify logic using eSewa API
// //   res.json({ success: true, message: "eSewa verify placeholder" });
// // });

// /* ======================================================
//    ESEWA PAYMENT
// ===================================================== */
// const ESEWA_MERCHANT_CODE = "EPAYTEST";
// const ESEWA_SECRET_KEY = "8gBm/:&EnhH.1/q";
// const ESEWA_BASE_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

// const SUCCESS_URL = "http://localhost:5000/api/payment/esewa/success";
// const FAILURE_URL = "http://localhost:5000/api/payment/esewa/fail";

// const pendingPayments = {};

// function generateUUID() {
//   return "TXN_" + Date.now();
// }

// // INIT PAYMENT (protected, because it creates booking later)
// app.post("/api/payment/esewa", async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount) {
//       return res.status(400).json({ success: false, message: "Amount is required" });
//     }

//     const product_amount = Number(amount);

//     // REQUIRED BY ESEWA V2
//     const tax_amount = 0;
//     const service_charge = 0;
//     const product_service_charge = 0;
//     const delivery_charge = 0;
//     const product_delivery_charge = 0;   // NEW REQUIRED FIELD

//     const total_amount =
//       product_amount +
//       tax_amount +
//       service_charge +
//       product_service_charge +
//       delivery_charge +
//       product_delivery_charge;

//     const transaction_uuid = generateUUID();

//     const signed_field_names =
//       "total_amount,transaction_uuid,product_code";

//     const signature_string =
//       `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${ESEWA_MERCHANT_CODE}`;

//     const signature = crypto
//       .createHmac("sha256", ESEWA_SECRET_KEY)
//       .update(signature_string)
//       .digest("base64");

//     const responsePayload = {
//       success: true,
//       esewaUrl: ESEWA_BASE_URL,
//       form: {
//         amount: product_amount,
//         tax_amount,
//         service_charge,
//         product_service_charge,
//         delivery_charge,
//         product_delivery_charge,      // NEW
//         total_amount,
//         transaction_uuid,
//         product_code: ESEWA_MERCHANT_CODE,
//         success_url: SUCCESS_URL,
//         failure_url: FAILURE_URL,
//         signed_field_names,
//         signature,
//       },
//     };

//     console.log("📤 Sending eSewa payload:", responsePayload);

//     return res.json(responsePayload);

//   } catch (err) {
//     console.error("❌ Esewa payment error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
// // PAYMENT SUCCESS
// app.get("/api/payment/esewa/success", async (req, res) => {
//   try {
//     const decoded = JSON.parse(
//       Buffer.from(req.query.data, "base64").toString()
//     );

//     const { transaction_uuid, total_amount } = decoded;

//     const verifyURL =
//       `https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=${ESEWA_MERCHANT_CODE}` +
//       `&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

//     const verify = await (await fetch(verifyURL)).json();

//     if (verify.status === "COMPLETE") {
//       const info = pendingPayments[transaction_uuid];

//       if (info) {
//         await Booking.create({
//           ...info,
//           paymentUUID: transaction_uuid,
//           paymentStatus: "SUCCESS",
//           status: "confirmed",
//         });

//         delete pendingPayments[transaction_uuid];
//       }

//       return res.redirect("http://localhost:5173/payment-success");
//     }

//     return res.redirect("http://localhost:5173/payment-failed");
//   } catch (err) {
//     console.error("PAYMENT SUCCESS HANDLER ERROR:", err);
//     return res.redirect("http://localhost:5173/payment-failed");
//   }
// });

// /* ======================================================
//    START SERVER
// ====================================================== */
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* ======================================================
   CONNECT MONGO
===================================================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ DB error:", err));

/* ======================================================
   USER MODEL (NEW)
===================================================== */
const UserSchema = new mongoose.Schema({
  fullName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  avatar: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

/* ======================================================
   VENUE + COURT MODELS
===================================================== */
const CourtSchema = new mongoose.Schema({
  courtId: String,
  name: String,
  type: String,
  pricePerHour: Number,
  timeSlots: [String],
});

const VenueSchema = new mongoose.Schema({
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
});

const Venue = mongoose.model("Venue", VenueSchema);

/* ======================================================
   BOOKING MODEL (UPDATED)
===================================================== */
const BookingSchema = new mongoose.Schema({
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

  maxPlayers: { type: Number, default: 0 },
  playersJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Booking = mongoose.model("Booking", BookingSchema);

/* ======================================================
   AUTH — REGISTER
===================================================== */
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

    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false });
  }
});

/* ======================================================
   AUTH — LOGIN
===================================================== */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid login" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json({ success: false, message: "Invalid login" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token, user });
  } catch (err) {
    res.json({ success: false });
  }
});

/* ======================================================
   VENUE ROUTES
===================================================== */
app.get("/", (req, res) => res.send("Futbook API OK"));

app.get("/api/venues", async (req, res) => {
  res.json({ success: true, data: await Venue.find() });
});

app.post("/api/venues", async (req, res) => {
  const venue = await Venue.create(req.body);
  res.json({ success: true, data: venue });
});

app.put("/api/venues/:id", async (req, res) => {
  res.json({
    success: true,
    data: await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true }),
  });
});

app.delete("/api/venues/:id", async (req, res) => {
  res.json({
    success: true,
    deleted: await Venue.findByIdAndDelete(req.params.id),
  });
});

/* ======================================================
   MANUAL BOOKING
===================================================== */
app.post("/api/bookings", async (req, res) => {
  try {
    const { venueId, courtId, date, timeSlot, userId } = req.body;

    const exists = await Booking.findOne({ venueId, courtId, date, timeSlot });

    if (exists)
      return res.json({ success: false, message: "Slot already booked" });

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
  } catch {
    res.json({ success: false });
  }
});

/* ======================================================
   GET BOOKINGS FOR USER
===================================================== */
app.get("/api/bookings/user/:id", async (req, res) => {
  const bookings = await Booking.find({ userId: req.params.id }).populate("venueId");

  const formatted = bookings.map((b) => {
    const venue = b.venueId;
    const court = venue?.courts?.find(c => c.courtId === b.courtId);

    const price = court?.pricePerHour ?? venue?.pricePerHour ?? 0;

    return {
      _id: b._id,
      date: b.date,
      timeSlot: b.timeSlot,
      courtName: court?.name,
      venueName: venue?.name,
      location: venue?.location,
      image: venue?.image,
      price,
      status: b.status === "cancelled"
        ? "cancelled"
        : b.paymentStatus === "SUCCESS"
        ? "confirmed"
        : "pending",
    };
  });

  res.json({ success: true, data: formatted });
});

/* ======================================================
   MODIFY BOOKING → Activate LOBBY
===================================================== */
app.put("/api/bookings/modify/:id", async (req, res) => {
  const { maxPlayers } = req.body;

  if (!maxPlayers || maxPlayers < 2)
    return res.json({ success: false, message: "Invalid count" });

  const booking = await Booking.findById(req.params.id);

  booking.status = "lobby-active";
  booking.maxPlayers = maxPlayers;
  booking.playersJoined = [booking.userId];

  await booking.save();

  res.json({ success: true, data: booking });
});

/* ======================================================
   CANCEL BOOKING
===================================================== */
app.put("/api/bookings/cancel/:id", async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  booking.status = "cancelled";
  booking.paymentStatus = "FAILED";
  await booking.save();

  res.json({ success: true });
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

/* ======================================================
   INIT PAYMENT
===================================================== */
app.post("/api/payment/esewa", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const product_amount = Number(amount);

    // REQUIRED BY ESEWA V2
    const tax_amount = 0;
    const service_charge = 0;
    const product_service_charge = 0;
    const delivery_charge = 0;
    const product_delivery_charge = 0;   // NEW REQUIRED FIELD

    const total_amount =
      product_amount +
      tax_amount +
      service_charge +
      product_service_charge +
      delivery_charge +
      product_delivery_charge;

    const transaction_uuid = generateUUID();

    const signed_field_names =
      "total_amount,transaction_uuid,product_code";

    const signature_string =
      `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${ESEWA_MERCHANT_CODE}`;

    const signature = crypto
      .createHmac("sha256", ESEWA_SECRET_KEY)
      .update(signature_string)
      .digest("base64");

    const responsePayload = {
      success: true,
      esewaUrl: ESEWA_BASE_URL,
      form: {
        amount: product_amount,
        tax_amount,
        service_charge,
        product_service_charge,
        delivery_charge,
        product_delivery_charge,      // NEW
        total_amount,
        transaction_uuid,
        product_code: ESEWA_MERCHANT_CODE,
        success_url: SUCCESS_URL,
        failure_url: FAILURE_URL,
        signed_field_names,
        signature,
      },
    };

    console.log("📤 Sending eSewa payload:", responsePayload);

    return res.json(responsePayload);

  } catch (err) {
    console.error("❌ Esewa payment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
/* ======================================================
   PAYMENT SUCCESS
===================================================== */
app.get("/api/payment/esewa/success", async (req, res) => {
  try {
    const decoded = JSON.parse(Buffer.from(req.query.data, "base64").toString());

    const { transaction_uuid, total_amount } = decoded;

    const verifyURL =
      `https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=${ESEWA_MERCHANT_CODE}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

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
  } catch {
    return res.redirect("http://localhost:5173/payment-failed");
  }
});

/* ======================================================
   START SERVER
===================================================== */
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
