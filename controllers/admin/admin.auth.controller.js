const jwt = require("jsonwebtoken");

login = async (req, res) => {
  const { email, password } = req.body;

  if (email !== "admin@gmail.com" || password !== "admin123") {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.status(200).json({
    message: "Login successful",
    token
  });
};

module.exports = {
  login, //  exported correctly
};

