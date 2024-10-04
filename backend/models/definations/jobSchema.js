// models/definitions/jobDefinition.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    maxSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    minSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: 'At least one tag is required.',
      },
    },
    education: {
      type: String,
      enum: ['Bachelors', 'Masters', 'PhD', 'Diploma', 'High School'],
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    jobType: {
      type: String,
      enum: ['Internship', 'Full-time', 'Part-time', 'Contract'],
      required: true,
    },
    jobRole: {
      type: String,
      enum: ['Junior', 'Mid', 'Senior', 'Lead'],
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    noOfVacancies: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    responsibilities: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = jobSchema;
