const Express = require("express");
const router = Express.Router();
const { createNewNote } = require("../controllers/note.controller");
const verifyToken = require("../middlewares/verify.token");
const { createNoteValidator } = require("../middlewares/note.validate");

router.post("/new-note", verifyToken, createNoteValidator, createNewNote);

module.exports = router;
