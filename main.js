const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const noteRoutes = require("./routes/note.routes");
const sharedNoteRoutes = require("./routes/shared.note.routes");
const profileRoutes = require("./routes/profile.route");
const adminRoutes = require("./routes/admin.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/note", noteRoutes);
app.use("/api/shared-note", sharedNoteRoutes);
app.use("/api/user", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);


module.exports = app;
