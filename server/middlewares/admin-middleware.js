// middlewares/admin-middleware.js
const jwt = require("jsonwebtoken");

const adminMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, Token not provided" });
  }

  const jwtToken = token.replace("Bearer ", "").trim();
  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_KEY);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    req.user = decoded; // Attach decoded token data to request
    next();
  } catch (error) {
    console.error("Admin middleware error:", error.message);
    return res.status(401).json({ message: "Unauthorized. Invalid or expired token." });
  }
};

module.exports = adminMiddleware;