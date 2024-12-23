const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, required: true },
  options: { type: [String], default: [] },
});

const exitInterviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema],
  uniqueLinkId: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "ExitApplicant" }],
});

module.exports = exitInterviewSchema;
