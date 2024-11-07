const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReviewForm.questions",
    required: true,
  },
  answer: { type: String, required: true },
});

const reviewFormApplicantSchema = new mongoose.Schema({
  answers: [answerSchema],
});

const ReviewFormApplicant = mongoose.model(
  "ReviewFormApplicant",
  reviewFormApplicantSchema
);

module.exports = ReviewFormApplicant;
