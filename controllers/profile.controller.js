const User = require("../models/user");
const comparePassword = require("../utils/compare.password");
const hashPassword = require("../utils/hash.password");

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

const updateEmail = async (req, res) => {
  console.log("Update email request body:", req.body);
  try {
    const userId = req.user._id;
    const { newEmail, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const existingEmail = await User.findOne({
      email: newEmail,
      _id: { $ne: userId },
    });
    if (existingEmail)
      return res.status(400).json({ message: "Email already in use" });

    user.email = newEmail;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      user: { email: user.email },
    });
  } catch (error) {
    console.error("Update email error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password" });

    user.password = await hashPassword(newPassword);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProfile, updateProfile, updateEmail, updatePassword };
