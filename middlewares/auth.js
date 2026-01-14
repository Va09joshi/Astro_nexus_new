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

    const user = verifyToken(token); // if async, use await
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid or expired token." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Token error:", err);
    return res.status(401).json({ error: "Invalid token." });
  }
}

/**
 * Web-based authentication (for server-rendered pages)
 */
export function authenticateTokenForWeb(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.redirect("/login");
    }

    const user = verifyToken(token);
    if (!user) {
      return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Web token error:", err);
    return res.redirect("/login");
  }
}

/**
 * Optional authentication: sets req.user if token exists
 */
export function optionalAuth(req, res, next) {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (token) {
      const user = verifyToken(token);
      if (user) req.user = user;
    }

    next();
  } catch (err) {
    console.error("Optional auth error:", err);
    next();
  }
}
