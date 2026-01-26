const SharedNote = require("../models/shared.note");
const Note = require("../models/note");
const { isSharedNoteExpired } = require("../utils/isShared.note.expired");
const { checkNoteLock } = require("../utils/check.note.lock");

const createSharedNote = async (req, res) => {
  try {
    const { noteId, permission, expiresInDays } = req.body;

    const note = await Note.findOne({ _id: noteId, user: req.user._id });
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    const shared_Note = await SharedNote.create({
      note: note._id,
      user: req.user._id,
      permission,
      expiresInDays,
    });

    res.json({
      success: true,
      message: "Share link created successfully",
      data: {
        link: `${req.protocol}://${req.get("host")}/api/shared-note/get-shared-link/${shared_Note.linkId}`,
        permission: shared_Note.permission,
        expiresInDays: shared_Note.expiresInDays,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSharedNote = async (req, res) => {
  try {
    const { linkId } = req.params;

    const sharedNote = await SharedNote.findOne({ linkId }).populate("note");

    if (!sharedNote) return res.status(404).json({ message: "Link not found" });

    if (isSharedNoteExpired(sharedNote))
      return res.status(403).json({ message: "Link expired" });

    if (!sharedNote.note)
      return res.status(404).json({ message: "Note deleted" });

    if (sharedNote.note.isLocked) {
      return res.json({
        locked: true,
        message: "Password required",
      });
    }

    res.json({
      sharedNote,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSharedNote,
  getSharedNote,
};
