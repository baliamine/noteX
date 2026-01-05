const Note = require("../models/note");
const { getFileUrl, deleteFile } = require("../middlewares/upload.file");

const createNewNote = async (req, res) => {
  try {
    if (req.validationErrors) {
      if (req.file) {
        deleteFile(req.file.path);
      }

      return res.status(400).json({
        errors: req.validationErrors,
      });
    }

    const { title, content, password, tags } = req.body;

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      isLocked: Boolean(password),
      password: password || undefined,
      tags: tags || [],
      file: req.file ? getFileUrl(req, req.file.filename) : null,
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file.path);
    }

    console.error("Create note error:", error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createNewNote,
};
