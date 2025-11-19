const express = require("express");
const { handleUserSignup, handleUserLogin, handleUserLogout } = require("../controllers/user");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

// Temporary test route
router.get("/test", (req, res) => {
  res.json({ message: "User route is working!" });
});

// Main Auth routes
router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/logout", authenticateToken, handleUserLogout);

module.exports = router;
