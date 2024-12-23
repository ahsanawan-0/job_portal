const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      enum: ["HR Manager", "admin"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 10, // Minimum 10 characters

      validate: {
        validator: function (v) {
          return v.length >= 10;
        },
        message: "Password must be atleast 10 characters long",
      },
    },
    // passwordResetToken: { type: String },
    // passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
