const express = require("express");
const router = express.Router();
const { Register, Login, Logout } = require("../controllers/authController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/otpController");
const  authMiddleware = require("../middlewares/authMiddleware");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/userValidation");

router.post("/register", registerValidation, Register);
router.post("/login", loginValidation, Login);
router.post("/logout", authMiddleware, Logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
