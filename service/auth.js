// backend/service/auth.js
import jwt from "jsonwebtoken";

/**
 * Create a JWT token for a user
 */
export function createToken(user) {
  const payload = {
    id: user._id,       // 🔥 must be `id` for middleware
    email: user.email,
    name: user.name,
    role: user.role,    // optional but recommended
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}


/**
 * Verify a JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}
