const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const connectToDb = require("./Config/ConnectToDb");

const app = express();


const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));



connectToDb();
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});