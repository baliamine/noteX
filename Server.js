const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); 
require("dotenv").config();
const connectToDb = require("./Config/ConnectToDb");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser()); 
app.use(morgan("dev"));

app.use("/api/note", noteRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
connectToDb();
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});