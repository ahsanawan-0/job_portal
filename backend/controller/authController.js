const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken")

module.exports = {
  signup: async (req, res) => {
    const { username, email, password, accountType } = req.body;
    try {
      let userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const user = new User({
        username,
        email,
        password: passwordHash,
        accountType,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });
      await user.save();

      // await sendVerificationEmail(user);

      res.status(201).json({
        success: true,
        message: "User Created Successfully ",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  login: async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const findUserByUsername = async (username) => {
      return await User.findOne({ username }).select("+password");
    };

    const findUserByEmail = async (email) => {
      return await User.findOne({ email }).select("+password");
    };
    try {
      const isEmail = usernameOrEmail.includes("@");
      const user = isEmail
        ? await findUserByEmail(usernameOrEmail)
        : await findUserByUsername(usernameOrEmail);

      if (!user) return res.status(401).json({ message: "Register First" });

      const comparedPassword = await bcrypt.compare(password, user.password);

      if (!comparedPassword) {
        return res.status(401).json({ message: "Wrong Password" });
      }
      // Generate a token
      const token = jwt.sign(
        { id: user.id, author: user.author, accountType: user.accountType },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      // Set the token as a cookie
      res.cookie("token", token, {
        httpOnly: true, // makes the cookie inaccessible to client-side JavaScript
        secure: process.env.NODE_ENV === "production", // sets the cookie to be used only with HTTPS in production
        maxAge: 3600000, // 1 hour
      });

      return res.status(200).json({
        success: true,
        message: "Login Successfully",
        role: user.accountType,
        token,
        author: user.username,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  
};
