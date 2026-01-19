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
const validateRequest = require("../middlewares/validate.request");

router.get("/get-profile", verifyToken, authorize("user"), getProfile);
router.put(
  "/update-profile",
  verifyToken,
  authorize("user"),
  validateRequest(updateProfileValidation),
  updateProfile,
);
router.put(
  "/update-email",
  verifyToken,
  authorize("user"),
  validateRequest(updateEmailValidation),
  updateEmail,
);
router.put(
  "/update-password",
  verifyToken,
  authorize("user"),
  validateRequest(updatePasswordValidation),
  updatePassword,
);
router.delete("/delete-account", verifyToken, authorize("user"), deleteAccount);

module.exports = router;
