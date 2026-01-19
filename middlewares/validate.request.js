const { validationResult } = require("express-validator");
const { deleteFile } = require("../utils/delete.file");

/**
 
 * @param {Array} validators 
 */
const validate = (validators) => {
  return async (req, res, next) => {
  
    for (let validator of validators) {
      await validator.run(req);
    }

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
};

module.exports = validate;
