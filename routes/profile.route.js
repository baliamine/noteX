const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  updateEmail,
  updatePassword,
} = require("../controllers/profile.controller");
const verifyToken = require("../middlewares/verify.token");
const { updateProfileValidation } = require("../validators/profile.validate");
const validate = require("../validators/validate");

router.get("/get-profile", verifyToken, getProfile);
router.put(
  "/update-profile",
  verifyToken,
  updateProfileValidation,
  validate,
  updateProfile
);
router.put("/update-email", verifyToken, updateEmail);
router.put("/update-password", verifyToken, updatePassword);


module.exports = router;
