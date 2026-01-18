const fs = require("fs");

const deleteFile = (filePath) => {
  if (!filePath) return;
console.log("Deleting file at path:", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("File deletion error:", err.message);
    }
  });
};

module.exports = {deleteFile};
