const mongoose = require("mongoose");
const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    content: { type: String, required: true },
    tags: [{ type: String }],
    isLocked: { type: Boolean, default: false },
    password: { type: String },
    file: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Note", noteSchema);
