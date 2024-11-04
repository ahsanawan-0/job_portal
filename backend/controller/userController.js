const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  signUp: async (req, res) => {
    try {
      const { name, designation, email, password } = req.body;

      if (designation !== "HR Manager" && designation !== "admin") {
        return res.status(400).json({ message: "Invalid designation." });
      }

      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      const newUser = await userModel.createUser({
        name,
        designation,
        email,
        password,
      });

      res
        .status(201)
        .json({ message: "User registered successfully.", user: newUser });
    } catch (error) {
      console.error("Error during sign up:", error.message);
      res
        .status(500)
        .json({ message: "Failed to register user.", error: error.message });
    }
  },

  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(password);

      // Find user by email
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      console.log(user.password);

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password." });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      // Send token as a cookie
      res.cookie("token", token, { httpOnly: true });

      res.status(200).json({ message: "User signed in successfully." });
    } catch (error) {
      console.error("Error during sign in:", error.message);
      res
        .status(500)
        .json({ message: "Failed to sign in.", error: error.message });
    }
  },
};
