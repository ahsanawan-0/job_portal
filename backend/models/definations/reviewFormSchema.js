const mongoose = require("mongoose");

const reviewQuestionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, required: true },
  options: { type: [String], default: [] },
});

const reviewFormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [reviewQuestionSchema],
  uniqueLinkId: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  applicants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ReviewFormApplicant" },
  ],
});

const ReviewForm = mongoose.model("ReviewForm", reviewFormSchema);
module.exports = ReviewForm;
