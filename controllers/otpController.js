const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const hashPassword = require("../utils/hashPassword");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

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
      "Password Reset OTP - NoteX",
      `
Bonjour ${user.username || ""},

Votre code OTP (One-Time Password) pour réinitialiser votre mot de passe est : **${otp}**

⚠️ Ce code est valide uniquement pendant 10 minutes. Ne partagez jamais ce code.

Si vous n’avez pas demandé cette réinitialisation, ignorez cet email.

Merci,
L’équipe NoteX
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

module.exports = { forgotPassword, resetPassword };
