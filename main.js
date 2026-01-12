const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");


const authRoutes = require("./routes/auth.routes");
const noteRoutes = require("./routes/note.routes");
const profileRoutes = require("./routes/profile.route");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/note", noteRoutes);
app.use("/api/user", authRoutes);
app.use("/api/profile", profileRoutes);

module.exports = app; 
