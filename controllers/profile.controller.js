const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = { getProfile };
