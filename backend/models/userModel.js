const User = require("./definations/userSchema");
const bcrypt = require("bcrypt");

module.exports = {
  createUser: async (userData) => {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      console.log("User Created:", user);
      return await user.save();
    } catch (error) {
      console.error(`Error creating user: ${error.message}`);
      throw error;
    }
  },

  findUserByEmail: async (email) => {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error(`Error finding user by email: ${error.message}`);
      throw error;
    }
  },

  updateUserPassword: async (email, newPassword) => {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      return await User.updateOne({ email }, { password: hashedPassword });
    } catch (error) {
      console.error(`Error updating user password: ${error.message}`);
      throw error;
    }
  },

  findUserById: async (id) => {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error(`Error finding user by ID: ${error.message}`);
      throw error;
    }
  },

  updateUserById: async (id, userData) => {
    try {
      return await User.findByIdAndUpdate(id, userData, { new: true });
    } catch (error) {
      console.error(`Error updating user by ID: ${error.message}`);
      throw error;
    }
  },
};
