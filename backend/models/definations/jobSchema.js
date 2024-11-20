const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0; // At least one tag is required
        },
        message: "At least one tag is required.",
      },
    },
    location: {
      type: String,
      required: true,
      enum: ["On-Site", "Remote", "Lahore"],
    },
    minSalary: {
      type: Number,
      required: true,
      min: 0, // Salary must be a positive number
    },
    maxSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    education: {
      type: String,
      enum: [
        "Bachelor's Degree",
        "Master's Degree",
        "Bachelors",
        "Masters",
        "PhD",
        "Ph.D.",
        "Diploma",
        "High School",
      ],
      required: true,
    },
    experience: {
      type: String,
      required: true,
      enum: ["1-2 Years", "3-5 Years", "5+ Years"],
    },
    jobType: {
      type: String,
      enum: ["Internship", "Full-Time", "Part-Time", "Contract"],
      required: false,
    },
    vacancies: {
      type: Number,
      required: true,
      min: 1,
    },
    jobRole: {
      type: String,
      enum: ["Junior", "Mid", "Senior", "Lead"],
      required: false,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Expired"],
      // default: "Active",
    },
    responsibilities: {
      type: String,
      required: true,
      trim: true,
    },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Applicants" }],

    shortListedApplicants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Applicants" },
    ],
    testInvitedApplicants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Applicants" },
    ],
    hiredApplicants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Applicants" },
    ],
    testForms: [{ type: mongoose.Schema.Types.ObjectId, ref: "testForm" }],
    onSiteInvite: [{ type: mongoose.Schema.Types.ObjectId, ref: "Applicants" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
