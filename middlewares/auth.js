const { verifyToken } = require("../service/auth");

function authenticateToken(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  req.user = user;
  next();
}

function authenticateTokenForWeb(req, res, next) {
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
}

function optionalAuth(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    const user = verifyToken(token);
    req.user = user;
  }

  next();
}

module.exports = {
  authenticateToken,
  authenticateTokenForWeb,
  optionalAuth,
};
