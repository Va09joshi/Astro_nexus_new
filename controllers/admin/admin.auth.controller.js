const jwt = require("jsonwebtoken");

// admin email and password (initial setup)
let ADMIN_EMAIL = "admin@gmail.com";
let ADMIN_PASSWORD = "admin123";

// login admin
const login = async (req, res) => {
  const { email, password } = req.body;

  // check email and password
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  // create token
  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.status(200).json({
    message: "Login successful",
    token,
  });
};

// update admin password
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // check required fields
  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Old password and new password required" });
  }

  // check old password
  if (oldPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Old password is wrong" });
  }

  // update password
  ADMIN_PASSWORD = newPassword;

  return res.status(200).json({
    message: "Password updated successfully",
  });
};

// logout admin
const logout = async (req, res) => {
  // jwt logout handled on client side
  return res.status(200).json({
    message: "Logout successful",
  });
};

module.exports = {
  login,
  updatePassword,
  logout,
};
