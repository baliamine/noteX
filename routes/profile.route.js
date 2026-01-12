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
const {
  updateProfileValidation,
  updateEmailValidation,
  updatePasswordValidation,
} = require("../validators/profile.validate");
const validate = require("../middlewares/validate");

router.get("/get-profile", verifyToken, getProfile);
router.put(
  "/update-profile",
  verifyToken,
  updateProfileValidation,
  validate,
  updateProfile
);
router.put(
  "/update-email",
  verifyToken,
  updateEmailValidation,
  validate,
  updateEmail
);
router.put(
  "/update-password",
  verifyToken,
  updatePasswordValidation,
  validate,
  updatePassword
);
router.delete("/delete-account", verifyToken, deleteAccount);

module.exports = router;
