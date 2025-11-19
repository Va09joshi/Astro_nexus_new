import express from "express";
import { getBirthChart } from "../controllers/birthChartController.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.send("Birth chart route working!");
});

// Main processing route
router.post("/", getBirthChart);

export default router;
