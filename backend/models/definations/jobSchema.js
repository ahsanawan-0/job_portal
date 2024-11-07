// models/definitions/jobDefinition.js
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
    },
    minSalary: {
      type: Number,
      required: true,
      min: 0, // Salary must be a positive number
    },
    maxSalary: {
      type: Number,
      required: true,
      min: 0, // Salary must be a positive number
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
      ], // Added "Bachelor's Degree" and "Master's Degree"
      required: true,
    },
    experience: {
      type: String, // Ensure this is a string to match frontend values like "5+ Years"
      required: true,
      enum: ["1-2 Years", "3-5 Years", "5+ Years"], // Allowed experience levels
    },
    jobType: {
      type: String,
      enum: ["Internship", "Full-Time", "Part-Time", "Contract"],
      required: false,
    },
    vacancies: {
      // Ensure the field name matches between frontend and backend
      type: Number,
      required: true,
      min: 1, // At least one vacancy is required
    },
    jobRole: {
      // Added 'jobRole'
      type: String,
      enum: ["Junior", "Mid", "Senior", "Lead"], // Define allowed job roles
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
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Applicants" }], // Array of applicant IDs

     shortListedApplicants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Applicants" },
    ],
    testInvitedApplicants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Applicants" },
    ],
    hiredApplicants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Applicants" },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

module.exports = jobSchema; // Export only the schema
