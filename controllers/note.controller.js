const mongoose = require("mongoose");
const Note = require("../models/note");
const { getFileUrl } = require("../middlewares/upload.file");
const { deleteFile } = require("../utils/delete.file");
const ApiFeatures = require("../config/api.features");
const hashPassword = require("../utils/hash.password");
const checkNoteLock = require("../utils/check.note.lock");
const note = require("../models/note");

const EditNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, notePassword, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(noteId))
      return res.status(400).json({ message: "Invalid note ID" });

    const note = await Note.findOne({ _id: noteId, user: req.user._id });
    if (!note) {
      if (req.file) deleteFile(req.file.path);

      return res.status(404).json({ message: "Note not found" });
    }

    await checkNoteLock(note, notePassword);

    if (req.file && note.file) {
      deleteFile(
        note.file.replace(
          `${req.protocol}://${req.get("host")}/uploads/`,
          "uploads/",
        ),
      );
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      {
        title: title ?? note.title,
        content: content ?? note.content,
        tags: tags ?? note.tags,
        file: req.file ? getFileUrl(req, req.file.filename) : note.file,
      },
      { new: true },
    );

    res.status(200).json({ message: "Note updated", note: updatedNote });
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    res.status(error.status || 500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { notePassword } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }
    const note = await Note.findOne({ _id: noteId, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await checkNoteLock(note, notePassword);

    await note.deleteOne();

    if (note.file) {
      const filePath = note.file.replace(
        `${req.protocol}://${req.get("host")}/uploads/`,
        "uploads/",
      );
      deleteFile(filePath);
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Server error",
    });
  }
};

const createNewNote = async (req, res) => {
  try {
    const { title, content, password, tags } = req.body;

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      isLocked: Boolean(password),
      password: hashedPassword,
      tags: tags || [],
      file: req.file ? getFileUrl(req, req.file.filename) : null,
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    console.error("Create note error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Server error",
    });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { notePassword } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findOne({
      _id: noteId,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await checkNoteLock(note, notePassword);

    res.status(200).json({
      message: "Note retrieved successfully",
      note,
    });
  } catch (error) {
    console.error("Get note by id error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Server error",
    });
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

    const total = await Note.countDocuments({
      user: req.user._id,
      ...features.query._conditions,
    });

    res.status(200).json({
      message: notes.length ? "Notes retrieved successfully" : "No notes found",
      meta: {
        total,
        page: features.pagination.page,
        limit: features.pagination.limit,
      },
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const setNotePassword = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { newPassword } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }
    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }
    const note = await Note.findOne({
      _id: noteId,
      user: req.user._id,
      password: { $exists: false },
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    const hashedPassword = await hashPassword(newPassword);
    note.password = hashedPassword;
    note.isLocked = true;
    await note.save();
    res.status(200).json({
      message: "Note password set successfully",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Server error",
    });
  }
};
const updateNotePassword = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { currentPassword, newPassword } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }
    const note = await Note.findOne({
      _id: noteId,
      user: req.user._id,
      password: { $exists: true },
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await checkNoteLock(note, currentPassword);

    const hashedPassword = await hashPassword(newPassword);

    note.password = hashedPassword;
    note.isLocked = true;
    await note.save();

    res.status(200).json({
      message: "Note password updated successfully",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Server error",
    });
  }
};

const deleteNotePassword = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { currentPassword } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findOne({
      _id: noteId,
      user: req.user._id,
      password: { $exists: true },
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await checkNoteLock(note, currentPassword);

    note.password = undefined;
    note.isLocked = false;
    await note.save();

    res.status(200).json({
      message: "Note password removed successfully",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  createNewNote,
  EditNote,
  getAllNotes,
  deleteNote,
  getNoteById,
  updateNotePassword,
  deleteNotePassword,
  setNotePassword,
};
