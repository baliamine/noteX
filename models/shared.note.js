const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");

const sharedNoteSchema = new Schema(
  {
    note: { type: Schema.Types.ObjectId, ref: "Note", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    linkId: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(16).toString("hex"),
    },
    permission: { type: String, enum: ["read", "edit"], default: "read" },
    expiresInDays: { type: Number, default: 30 },
    unlockAllowed: { type: Boolean, default: false },
  },

  { timestamps: true },
);

module.exports = mongoose.model("SharedNote", sharedNoteSchema);
