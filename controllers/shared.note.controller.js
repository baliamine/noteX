const SharedNote = require("../models/shared.note");
const Note = require("../models/note");
const { isSharedNoteExpired } = require("../utils/isShared.note.expired");

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
        link: `${req.protocol}://${req.get("host")}/share/${shared_Note.linkId}`,
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
    console.log("linkId:", linkId);

    const shared_Note = await SharedNote.findOne({ linkId }).populate("note");
    console.log("shared_Note:", shared_Note);
    if (!shared_Note)
      return res
        .status(404)
        .json({ success: false, message: "Link not found" });

    if (isSharedNoteExpired(shared_Note)) {
      return res.status(403).json({ success: false, message: "Link expired" });
    }

    if (!shared_Note.note) {
      return res
        .status(404)
        .json({ success: false, message: "Note no longer exists" });
    }

    res.json({
      success: true,
      note: shared_Note.note,
      permission: shared_Note.permission,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createSharedNote,
  getSharedNote,
};
