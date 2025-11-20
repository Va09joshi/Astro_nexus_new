import express from "express";
import { handleUserSignup, handleUserLogin, handleUserLogout } from "../controllers/user.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "User route is working!" });
});

// Authentication routes
router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/logout", authenticateToken, handleUserLogout);

console.log("User routes loaded");

export default router;
