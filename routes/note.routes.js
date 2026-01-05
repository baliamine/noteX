const Express = require("express");
const router = Express.Router();
const {
  createNewNote,
  EditNote,
  getAllNotes,
  deleteNote,
  getNoteById,
} = require("../controllers/note.controller");
const verifyToken = require("../middlewares/verify.token");
const { createNoteValidator } = require("../middlewares/note.validate");
const { uploadSingle } = require("../middlewares/upload.file");

router.post(
  "/new-note",
  verifyToken,
  uploadSingle("file"),
  createNoteValidator,
  createNewNote
);

router.put(
  "/edit-note/:noteId",
  verifyToken,
  uploadSingle("file"),
  createNoteValidator,
  EditNote
);
router.delete("/delete-note/:noteId", verifyToken, deleteNote);

router.get("/all-notes", verifyToken, getAllNotes);
router.get("/note-byId/:noteId", verifyToken, getNoteById);
module.exports = router;
