const { validationResult } = require("express-validator");
const { deleteFile } = require("../utils/delete.file");

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    if (req.file && req.file.path) {
      console.log("Deleting file due to validation errors:", req.file.path);
      deleteFile(req.file.path);
    }

    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};
