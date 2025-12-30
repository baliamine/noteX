const mongoose = require("mongoose");
const { Schema } = mongoose;
const noteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    isLocked: { type: Boolean, default: false },
    password: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Note", noteSchema);
