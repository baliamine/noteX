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


const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, password, tags } = req.body;

    const note = await Note.findOne({ _id: id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.title = title || note.title;
    note.content = content || note.content;
    note.isLocked = password ? true : false;
    note.password = password || undefined;
    note.tags = tags || note.tags;

    await note.save();

    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createNewNote,
  getAllNotes,
  updateNote,
  deleteNote,
};
