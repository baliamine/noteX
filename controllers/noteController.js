const Note = require("../models/note");

const createNewNote = async (req, res) => {
  try {
    const { title, content, password, tags } = req.body;

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      isLocked: password ? true : false,
      password: password || undefined,
      tags: tags || [],
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createNewNote };
