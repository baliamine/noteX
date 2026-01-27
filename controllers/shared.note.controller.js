const SharedNote = require("../models/shared.note");
const Note = require("../models/note");
const { isSharedNoteExpired } = require("../utils/isShared.note.expired");
const checkNoteLock = require("../utils/check.note.lock");

const createSharedNote = async (req, res) => {
  try {
    const { noteId, permission, expiresInDays, notePassword } = req.body;

    const note = await Note.findOne({ _id: noteId, user: req.user._id });
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }
    await checkNoteLock(note, notePassword);

    const sharedNote = await SharedNote.create({
      note: note._id,
      user: req.user._id,
      permission,
      expiresInDays,
      unlockAllowed: true,
    });

    return res.json({
      success: true,
      message: "Share link created successfully",
      link: `${req.protocol}://${req.get("host")}/api/shared-note/get-shared-link/${sharedNote.linkId}`,
      permission: sharedNote.permission,
      expiresInDays: sharedNote.expiresInDays,
      unlocked: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSharedNote = async (req, res) => {
  try {
    const { linkId } = req.params;

    const sharedNote = await SharedNote.findOne({ linkId }).populate("note");

    if (!sharedNote) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }

    if (isSharedNoteExpired(sharedNote)) {
      return res.status(403).json({
        success: false,
        message: "Link expired",
      });
    }

    if (!sharedNote.note) {
      return res.status(404).json({
        success: false,
        message: "Note deleted",
      });
    }

    if (sharedNote.note.isLocked && !sharedNote.unlockAllowed) {
      return res.json({
        success: false,
        locked: true,
        message: "Password required",
      });
    }

    return res.json({
      success: true,
      message: "Note fetched successfully",
      sharedNote,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createSharedNote,
  getSharedNote,
};
