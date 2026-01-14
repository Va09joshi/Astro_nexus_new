import express from "express";
import { handleUserSignup, handleUserLogin, handleUserLogout } from "../controllers/users/user.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();
import orderRoutes from "../routes/users/order.js";




// Test route
router.get("/test", (req, res) => {
  res.json({ message: "User route is working!" });
});

router.use("/orders", orderRoutes);

// Authentication routes
router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/logout", authenticateToken, handleUserLogout);

console.log("User routes loaded");

export default router;
