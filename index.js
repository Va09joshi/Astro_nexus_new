import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from "url";

import { connectToMongoDB } from "./connect.js";
import { authenticateToken, optionalAuth } from "./middlewares/auth.js";
import URL from "./models/url.js";

import predictionsRoute from "./routes/predictions.js";
import birthChartRoute from "./routes/birthchart.js";
import urlRoute from "./routes/url.js";
import staticRoute from "./routes/staticRouter.js";
import userRoute from "./routes/user.js";

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 8001;

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------
// ✅ MongoDB Connection
// ------------------------------------------------------
connectToMongoDB(process.env.MONGODB_URI)
  .then(() => console.log("✓ MongoDB connected"))
  .catch((err) => {
    console.error("✗ MongoDB connection error:", err);
    process.exit(1); // stop server if DB fails
  });

// ------------------------------------------------------
// View Engine
// ------------------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ------------------------------------------------------
// Middlewares
// ------------------------------------------------------
app.use(
  cors({
    origin: ["http://localhost:5173", "https://astro-nexus.onrender.com"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------------------------------------------
// Prediction APIs
// ------------------------------------------------------
app.use("/api/predictions", predictionsRoute);
app.use("/api/birthchart", birthChartRoute);

// ------------------------------------------------------
// Health Check
// ------------------------------------------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ------------------------------------------------------
// Short URL Redirect
// ------------------------------------------------------
app.get("/url/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: new Date() } } },
      { new: true }
    );

    if (!entry) return res.status(404).json({ error: "Short URL not found" });

    return res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ------------------------------------------------------
// API Routes
// ------------------------------------------------------
app.use("/api/url", authenticateToken, urlRoute);
app.use("/user", userRoute);

// ------------------------------------------------------
// Static Website Pages
// ------------------------------------------------------
app.use("/", optionalAuth, staticRoute);

// ------------------------------------------------------
// 404 Handler
// ------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ------------------------------------------------------
// Error Handler
// ------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ------------------------------------------------------
// Server Start
// ------------------------------------------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
