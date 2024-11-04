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
};
