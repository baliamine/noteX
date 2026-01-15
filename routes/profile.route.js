const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteAccount,
} = require("../controllers/profile.controller");
const verifyToken = require("../middlewares/verify.token");
const authorize = require("../middlewares/authorize.role");

const {
  updateProfileValidation,
  updateEmailValidation,
  updatePasswordValidation,
} = require("../validators/profile.validate");
const validate = require("../middlewares/validate");

router.get("/get-profile", verifyToken, authorize("user"), getProfile);
router.put(
  "/update-profile",
  verifyToken,
  authorize("user"),
  updateProfileValidation,
  validate,
  updateProfile
);
router.put(
  "/update-email",
  verifyToken,
  authorize("user"),
  updateEmailValidation,
  validate,
  updateEmail
);
router.put(
  "/update-password",
  verifyToken,
  authorize("user"),
  updatePasswordValidation,
  validate,
  updatePassword
);
router.delete("/delete-account", verifyToken, authorize("user"), deleteAccount);

module.exports = router;
