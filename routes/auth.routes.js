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
} = require("../validators/auth.validate");
const validate = require("../middlewares/validate");

const verifyToken = require("../middlewares/verify.token");
router.post("/register", registerValidation, validate, Register);

router.post("/login", loginValidation, validate, Login);
router.post("/refresh-token", verifyToken, RefreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", verifyToken, Logout);

module.exports = router;
