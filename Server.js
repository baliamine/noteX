const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); 
require("dotenv").config();
const connectToDb = require("./config/ConnectToDb");
const authRoutes = require("./routes/auth.routes");
const noteRoutes = require("./routes/note.routes");
const profileRoutes = require("./routes/profile.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser()); 
app.use(morgan("dev"));

app.use("/api/note", noteRoutes);
app.use("/api/user", authRoutes);
app.use("/api/profile", profileRoutes);



const PORT = process.env.PORT || 5000;
connectToDb();
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});