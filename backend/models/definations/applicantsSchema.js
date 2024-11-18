const mongoose = require("mongoose");

const applicantsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    applications: [
      {
        name: { type: String, required: true },
        experience: {
          type: String,
          required: [true, "Experience is required"],
          enum: [
            "0-6 months",
            "1 year",
            "2 years",
            "3 years",
            "4 years",
            "5 years",
            "6 years",
          ],
        },
        coverLetter: { type: String, required: true },
        resume: { type: String, required: true }, // Store resume ID or path
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
        appliedAt: { type: Date, default: Date.now },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Applicants = mongoose.model("Applicants", applicantsSchema);
module.exports = Applicants;