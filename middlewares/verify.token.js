const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;


    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res
      .status(401)
      .json({ message: "Unauthorized, token invalid or expired" });
  }
};

module.exports = verifyToken;
