const Note = require("../models/note");
const { getFileUrl, deleteFile } = require("../middlewares/upload.file");
const ApiFeatures = require("../utils/api.features");

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

const EditNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, password, tags } = req.body;

    if (req.validationErrors) {
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({ errors: req.validationErrors });
    }

    const note = await Note.findOne({ _id: noteId, user: req.user._id });
    if (!note) {
      if (req.file) deleteFile(req.file.path);
      return res.status(404).json({ message: "Note not found" });
    }

    if (req.file && note.file) {
      const oldFilePath = note.file.replace(
        `${req.protocol}://${req.get("host")}/uploads/`,
        "uploads/"
      );
      deleteFile(oldFilePath);
    }

    const updatedData = {
      title: title || note.title,
      content: content || note.content,
      isLocked: Boolean(password),
      password: password || undefined,
      tags: tags || note.tags,
      file: req.file ? getFileUrl(req, req.file.filename) : note.file,
    };

    const updatedNote = await Note.findByIdAndUpdate(noteId, updatedData, {
      new: true,
    });

    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    console.error("Edit note error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const baseQuery = Note.find({ user: req.user._id });

    const features = new ApiFeatures(baseQuery, req.query)
      .search(["title", "content", "tags"])
      .sort()
      .paginate();

    const notes = await features.query;
    const total = await Note.countDocuments({ user: req.user._id });

    res.status(200).json({
      message: "Notes retrieved successfully",
      meta: {
        total,
        page: features.pagination.page,
        limit: features.pagination.limit,
      },
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({
      _id: noteId,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.file) {
      const filePath = note.file.replace(
        `${req.protocol}://${req.get("host")}/uploads/`,
        "uploads/"
      );
      deleteFile(filePath);
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      user: req.user._id, 
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note retrieved successfully",
      note,
    });
  } catch (error) {
    console.error("Get note by id error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createNewNote,
  EditNote,
  getAllNotes,
  deleteNote,
  getNoteById
};
