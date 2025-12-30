const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");

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

    const newUser = User.create({
      username,
      email,
      password: hashedPassword,
      phone,
    });

    const token = generateToken(newUser);
    res.status(201).json({
      message: "User registered successfully",
      token,
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

    const token = generateToken(user);

    // Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Logout = (req, res) => {
  res
    .cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "strict" })
    .status(200)
    .json({ message: "Logged out successfully" });
};



module.exports = { Register, Login, Logout };
