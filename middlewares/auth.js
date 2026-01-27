import { verifyToken } from "../service/auth.js";

/**
 * Middleware: Authenticate API token (for Flutter / mobile / API requests)
 */
export async function authenticateToken(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    const decoded = verifyToken(token);
    if (!decoded?.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({ error: "Invalid token payload." });
    }

    const user = await User.findById(decoded.id).select("_id email role");
    if (!user) return res.status(401).json({ error: "User no longer exists." });

    req.userId = user._id; // ✅ ALWAYS OBJECTID
    req.user = user;       // ✅ Fresh DB user

    next();
  } catch (err) {
    console.error("Token error:", err);
    return res.status(401).json({ error: "Invalid token." });
  }
}

/**
 * Middleware: Authenticate token for web routes (cookie-based)
 */
export function authenticateTokenForWeb(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) return res.redirect("/login");

    const decoded = verifyToken(token);

    if (!decoded) return res.redirect("/login");

    req.userId = decoded.id || decoded.email;
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Web token error:", err);
    return res.redirect("/login");
  }
}

/**
 * Middleware: Optional authentication
 * If a token exists, attaches user info; otherwise proceeds without error
 */
export function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        req.userId = decoded.id || decoded.email;
        req.user = decoded;
      }
    }

    next();
  } catch (err) {
    console.error("Optional auth error:", err);
    next();
  }
}
