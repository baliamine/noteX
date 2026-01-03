const { body, validationResult } = require("express-validator");

exports.createNoteValidator = [
  body("title")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters"),

  body("content").trim().notEmpty().withMessage("Content is required"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),

  body("tags.*").optional().isString().withMessage("Each tag must be a string"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters if note is locked"),

  body("isLocked")
    .optional()
    .isBoolean()
    .withMessage("isLocked must be a boolean"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
];
