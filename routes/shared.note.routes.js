const Express = require("express");
const router = Express.Router();
const verifyToken = require("../middlewares/verify.token");
const authorize = require("../middlewares/authorize.role");
const {
  createSharedNote,
  getSharedNote,
} = require("../controllers/shared.note.controller");

router.post(
  "/create-shared-link",
  verifyToken,
  authorize("user"),
  createSharedNote,
);

router.get("/get-shared-link/:linkId", getSharedNote);

module.exports = router;
