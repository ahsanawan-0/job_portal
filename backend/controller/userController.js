const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  signUp: async (req, res) => {
    try {
      const { name, designation, email, password } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required." });
      }
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
      if (!password) {
        return res.status(400).json({ message: "Password is required." });
      }

      if (designation !== "HR Manager" && designation !== "admin") {
        return res.status(400).json({ message: "Invalid designation." });
      }
      if (password.length < 10) {
        return res
          .status(400)
          .json({ message: "Password must be at least 10 characters long." });
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
      if (error.name === "ValidationError") {
        // Extract the specific validation error message
        const errors = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({ message: errors });
      } else {
        // For other errors, log and send a generic error response
        console.error("Error during sign up:", error.message);
        res
          .status(500)
          .json({ message: "Failed to register user.", error: error.message });
      }
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
        expiresIn: "7d",
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

  resetPassword: async (req, res) => {
    try {
      const { email, newPassword, confirmPassword } = req.body;

      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      // Find user by email
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Update password
      await userModel.updateUserPassword(email, newPassword);

      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      console.error("Error during password reset:", error.message);
      res
        .status(500)
        .json({ message: "Failed to reset password.", error: error.message });
    }
  },

  getUserData: async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await userModel.findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const { password, ...userData } = user.toObject();

      res.status(200).json({ user: userData });
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      res
        .status(500)
        .json({ message: "Failed to fetch user data.", error: error.message });
    }
  },

  updateUserData: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, email, password, designation } = req.body;

      const user = await userModel.findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      let hashedPassword;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      }

      const updatedUserData = {
        name: name || user.name,
        email: email || user.email,
        ...(hashedPassword && { password: hashedPassword }),
        designation: designation !== undefined ? designation : user.designation,
      };

      const updatedUser = await userModel.updateUserById(
        userId,
        updatedUserData
      );
      res.status(200).json({
        message: "User data updated successfully.",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user data:", error.message);
      res
        .status(500)
        .json({ message: "Failed to update user data.", error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve users",
        error: error.message,
      });
    }
  },

  getAllUsersNotAdmin: async (req, res) => {
    try {
      const users = await userModel.getAllUsersExcludingAdmin(req.user.id);
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve users",
        error: error.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    const { email } = req.body;
    try {
      const result = await userModel.deleteUserByEmail(email);
      if (result) {
        res.status(200).json({
          success: true,
          message: "User deleted successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete user",
        error: error.message,
      });
    }
  },
};
