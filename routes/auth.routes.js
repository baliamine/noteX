const express = require("express");
const router = express.Router();
const {
  Register,
  Login,
  RefreshToken,
  forgotPassword,
  resetPassword,
  Logout,
} = require("../controllers/auth.controller");

const {
  registerValidation,
  loginValidation,
} = require("../middlewares/user.validate");

const verifyToken = require("../middlewares/verify.token");
router.post("/register", registerValidation, Register);
router.post("/login", loginValidation, Login);
router.post("/refresh-token",verifyToken, RefreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout",verifyToken, Logout);

module.exports = router;
