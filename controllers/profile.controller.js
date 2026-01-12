const User = require("../models/user");

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

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, phone } = req.body;

    if (phone) {
      const existingPhoneNumber = await User.findOne({
        phone,
        _id: { $ne: userId }, // exclure l'utilisateur courant
      });

      if (existingPhoneNumber) {
        return res.status(400).json({ message: "Phone number already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProfile, updateProfile };
