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
import compatibilityRoute from "./routes/compatablity.js"; // <-- Import here

const app = express();
app.set("trust proxy", 1); // needed for Render/Vercel

const PORT = process.env.PORT || 8001;

// get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// connect DB
connectToMongoDB(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log("MongoDB error:", err);
    process.exit(1);
  });

// ejs setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// api routes
app.use("/api/predictions", predictionsRoute);
app.use("/api/birthchart", birthChartRoute);
app.use("/api/v1/compatibility", compatibilityRoute);

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// short url redirect
app.get("/url/:shortId", async (req, res) => {
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId: req.params.shortId },
      { $push: { visitHistory: { timestamp: new Date() } } },
      { new: true }
    );

    if (!entry) return res.status(404).json({ error: "Not found" });

    return res.redirect(entry.redirectURL);
  } catch (err) {
    console.log("Redirect error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// protected URL API
app.use("/api/url", authenticateToken, urlRoute);

// user auth routes
app.use("/user", userRoute);

// static pages
app.use("/", optionalAuth, staticRoute);

// not found
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// error handler
app.use((err, req, res, next) => {
  console.log("Error:", err);
  res.status(500).json({ error: err.message || "Server error" });
});

// start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
