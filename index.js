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

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------
// MongoDB Connection
// --------------------------
connectToMongoDB(process.env.MONGODB_URI)
  .then(() => console.log("✓ MongoDB connected"))
  .catch((err) => {
    console.error("✗ MongoDB connection error:", err);
    process.exit(1);
  });

// --------------------------
// View Engine
// --------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --------------------------
// Middleware
// --------------------------
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --------------------------
// Astro Predictions API
// --------------------------
app.use("/api/predictions", predictionsRoute);
app.use("/api/birthchart", birthChartRoute);

// --------------------------
// Health Route
// --------------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --------------------------
// Short URL Redirect
// --------------------------
app.get("/url/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: new Date() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --------------------------
// API Routes
// --------------------------
app.use("/api/url", authenticateToken, urlRoute);
app.use("/user", userRoute);

// --------------------------
// Web Routes
// --------------------------
app.use("/", optionalAuth, staticRoute);

// --------------------------
// 404 Handler
// --------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// --------------------------
// Global Error Handler
// --------------------------
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// --------------------------
// Start Server
// --------------------------
app.listen(PORT, () => {
  console.log(`✓ Server started at http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
});
