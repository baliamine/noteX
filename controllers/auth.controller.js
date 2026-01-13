const User = require("../models/user");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generate.token");
const hashPassword = require("../utils/hash.password");
const comparePassword = require("../utils/compare.password");
const sendEmail = require("../helpers/send.email");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const Register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    const existingPhoene = await User.findOne({ phone });
    if (existingPhoene) {
      return res.status(400).json({ message: "Phone number already in use" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      role: "user",
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const RefreshToken = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Error refreshing token:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP - MindBook",
      `
Bonjour ${user.username || ""},

Votre code de réinitialisation F : **${otp}**

⚠️ Ce code est valide uniquement pendant 10 minutes. Ne partagez jamais ce code.

Si vous n’avez pas demandé cette réinitialisation, ignorez cet email.

Merci,
L’équipe MindBook
`
    );

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resetOTP != otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const Logout = (req, res) => {
  res
    .clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};

module.exports = {
  Register,
  Login,
  RefreshToken,
  forgotPassword,
  resetPassword,
  Logout,
};
