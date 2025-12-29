const express = require("express");
const router = express.Router();
const { Register, Login } = require("../controllers/authController");
const { forgotPassword, resetPassword } = require("../controllers/otpController");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/userValidation");

router.post("/register", registerValidation, Register);
router.post("/login", loginValidation, Login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports = router;
