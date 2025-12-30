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
      return res.status(400).json({ message: "User not found " });
    }
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (isMatch) {
      const token = generateToken(user);
      return res.status(200).json({
        message: "Login successful",
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { Register, Login };
