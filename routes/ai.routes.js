const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verify.token");
const authorize = require("../middlewares/authorize.role");
const aiController = require("../controllers/ai.controller");

router.post("/ask", verifyToken, authorize("user"), aiController.askAI);

module.exports = router;
