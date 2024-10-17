const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Please add an username"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false, // prevents the password from being returned by default in queries
    },
    accountType: {
      type: String,
      default: "buyer",
    },
    uploads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostModel",
      },
    ],
    purchased: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    fevorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String, // Store the 4-digit code here
    verificationTokenExpiresAt: String, // Expires 4-digit code here
    // resetPasswordToken: String, //
    // resetPasswordExpiresAt: String, //
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
