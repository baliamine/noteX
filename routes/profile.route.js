const express = require("express");

const router = express.Router();

const { getProfile } = require("../controllers/profile.controller");
const verifyToken = require("../middlewares/verify.token");

router.get("/get-profile", verifyToken, getProfile);

module.exports = router;
