const Express = require("express");
const router = Express.Router();
const {
  createNewNote,
  EditNote,
  getAllNotes,
  deleteNote,
  getNoteById,
  updateNotePassword,
  deleteNotePassword,
} = require("../controllers/note.controller");
const verifyToken = require("../middlewares/verify.token");
const { NoteValidator } = require("../validators/note.validate");
const { uploadSingle } = require("../middlewares/upload.file");
const authorize = require("../middlewares/authorize.role");
const validateRequest = require("../middlewares/validate.request");

router.post(
  "/new-note",
  verifyToken,
  authorize("user"),
  uploadSingle("file"),
  validateRequest(NoteValidator),
  createNewNote,
);

router.put(
  "/edit-note/:noteId",
  verifyToken,
  authorize("user"),
  uploadSingle("file"),
  validateRequest(NoteValidator),
  EditNote,
);
router.delete(
  "/delete-note/:noteId",
  verifyToken,
  authorize("user"),
  deleteNote,
);

router.put(
  "/update-note-password/:noteId",
  verifyToken,
  authorize("user"),
  updateNotePassword,
);
router.delete(
  "/delete-note-password/:noteId",
  verifyToken,
  authorize("user"),
  deleteNotePassword,
);
router.get("/all-notes", verifyToken, authorize("user"), getAllNotes);
router.get("/note-byId/:noteId", verifyToken, authorize("user"), getNoteById);
module.exports = router;
