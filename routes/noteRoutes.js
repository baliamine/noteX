const Express = require("express");
const router = Express.Router();
const {createNewNote} = require("../controllers/noteController");
const authMiddleware= require("../middlewares/authMiddleware");

router.post("/new-note", authMiddleware, createNewNote);

module.exports = router;
