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
const { createNoteValidator } = require("../validators/note.validate");
const validate = require("../middlewares/validate");
const { uploadSingle } = require("../middlewares/upload.file");
const authorize = require("../middlewares/authorize.role");

router.post(
  "/new-note",
  verifyToken,
  authorize("user"),
  uploadSingle("file"),
  createNoteValidator,
  validate,
  createNewNote
);

router.put(
  "/edit-note/:noteId",
  verifyToken,
  authorize("user"),
  uploadSingle("file"),
  createNoteValidator,
  validate,
  EditNote
);
router.delete(
  "/delete-note/:noteId",
  verifyToken,
  authorize("user"),
  deleteNote
);

router.get("/all-notes", verifyToken, authorize("user"), getAllNotes);
router.get("/note-byId/:noteId", verifyToken, authorize("user"), getNoteById);
module.exports = router;
