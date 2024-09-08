const jwt = require("jsonwebtoken");
const Mentee = require("../models/mentee-model");

const menteeMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, Token not provided" });
  }

  const jwtToken = token.replace("Bearer ", "").trim();
  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_KEY);
    const userData = await Mentee.findById(isVerified.userId).select({ password: 0 });

    if (!userData) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    req.token = token;
    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

module.exports = menteeMiddleware;
