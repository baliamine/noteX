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
