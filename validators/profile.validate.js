const { body } = require("express-validator");

exports.updateProfileValidation = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("phone")
    .optional()
    .matches(/^\+?[0-9]{8,15}$/)
    .withMessage("Phone must be a valid number"),
];



// Validation for updating email
exports.updateEmailValidation = [
  body("newEmail")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];



// Validation for updating password
exports.updatePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .isLength({ min: 6 })
    .withMessage("Current password must be at least 6 characters"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];