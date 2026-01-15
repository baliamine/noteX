require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const connectToDb = require("../config/ConnectToDb");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const AdminName = process.env.ADMIN_NAME;
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment variables."
  );
  process.exit(1);
}

async function injectAdmin() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await connectToDb();

    const admin = await User.findOne({ email: ADMIN_EMAIL });

    if (admin) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const newAdmin = new User({
      username: AdminName,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    console.log("Super Admin created successfully.");
  } catch (error) {
    console.error("Error while checking/creating admin:", error);
  }
}

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

injectAdmin();
