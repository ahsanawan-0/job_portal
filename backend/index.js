const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");

const connectDB = require("./dbConnection");
const cors = require("cors");
const cron = require("node-cron");
const mongoose = require("mongoose");
const jobSchema = require("./models/definations/jobSchema");
const User = require("./models/definations/userSchema");
const bcrypt = require("bcrypt");

connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:4200", // Replace with your frontend's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials (cookies) to be sent
};
app.use(cors(corsOptions));

const Job = mongoose.model("Job", jobSchema);

const port = process.env.PORT;
const { readdirSync } = require("fs");
readdirSync("./Router").map((route) => {
  app.use("/api", require(`./Router/${route}`));
});
app.listen(port, () => {
  console.log(`"server  is listening on a ${port}`);
});

// cron.schedule("0 0 * * *", async () => {
//   try {
//     const currentDate = new Date();
//     await Job.updateMany(
//       { expirationDate: { $lt: currentDate }, status: "Active" },
//       { status: "Expired" }
//     );
//     console.log("Expired job statuses updated successfully.");
//   } catch (error) {
//     console.error("Error updating job statuses:", error);
//   }
// });

const updateExpiredJobs = async () => {
  try {
    const currentDate = new Date();
    await Job.updateMany(
      { expirationDate: { $lt: currentDate }, status: "Active" },
      { status: "Expired" }
    );
  } catch (error) {
    console.error("Error updating initial expired job statuses:", error);
  }
};

updateExpiredJobs(); // Run this once at startup

// Schedule the job expiration check daily
cron.schedule("0 0 * * *", updateExpiredJobs);

const initializeAdminAccount = async () => {
  try {
    // Check if the admin account already exists
    const existingAdmin = await User.findOne({ email: "admin@sdsol.com" });

    if (!existingAdmin) {
      // Hash the password
      const hashedPassword = await bcrypt.hash("admin12345", 10);

      // Create a new admin account
      const newAdmin = new User({
        name: "Admin",
        designation: "admin", // Set designation as 'admin'
        email: "admin@sdsol.com",
        password: hashedPassword,
      });

      // Save the admin account to the database
      await newAdmin.save();
      console.log("Admin account created successfully.");
    } 
  } catch (error) {
    console.error("Error initializing admin account:", error);
  }
};

initializeAdminAccount();
