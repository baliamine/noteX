const { body } = require("express-validator");

exports.NoteValidator = [
  body("title")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters"),

  body("content").trim().notEmpty().withMessage("Content is required"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("isLocked")
    .optional()
    .isBoolean()
    .withMessage("isLocked must be a boolean"),
];
