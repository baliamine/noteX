const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;

const connectToDb = () => {
  if (!DB_URL) {
    console.error("❌ DB_URL is missing in .env file");
    process.exit(1);
  }
  mongoose
    .connect(DB_URL)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1);
    });
};

module.exports = connectToDb;
