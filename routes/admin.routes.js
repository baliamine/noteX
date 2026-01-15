const router = require("express").Router();
const { getAllProfiles } = require("../controllers/profile.controller");

const verifyToken = require("../middlewares/verify.token");
const authorize = require("../middlewares/authorize.role");

router.get("/get-all-profiles", verifyToken, authorize("admin"), getAllProfiles);


module.exports = router;