import { verifyToken } from "../service/auth.js";

/**
 * API token authentication
 */
export function authenticateToken(req, res, next) {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = verifyToken(token); // must return { id: userId }

    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ error: "Invalid or expired token." });
    }

    // ✅ THIS IS THE FIX
    req.userId = decoded.id; // ObjectId ONLY (for DB)
    req.user = decoded;      // optional (for other APIs)

    next();
  } catch (err) {
    console.error("Token error:", err);
    return res.status(401).json({ error: "Invalid token." });
  }
}

export function authenticateTokenForWeb(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) return res.redirect("/login");

    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) return res.redirect("/login");

    req.userId = decoded.id;
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Web token error:", err);
    return res.redirect("/login");
  }
}

export function optionalAuth(req, res, next) {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (token) {
      const decoded = verifyToken(token);
      if (decoded?.id) {
        req.userId = decoded.id;
        req.user = decoded;
      }
    }

    next();
  } catch (err) {
    console.error("Optional auth error:", err);
    next();
  }
}
