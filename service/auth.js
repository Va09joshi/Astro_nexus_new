const jwt = require("jsonwebtoken");

function createToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    name: user.name,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  createToken,
  verifyToken,
};
