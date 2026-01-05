const Express = require("express");
const router = Express.Router();
const { createNewNote } = require("../controllers/note.controller");
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

module.exports = router;
