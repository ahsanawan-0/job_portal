const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExitInterview.questions",
    required: true,
  },
  answer: { type: String, required: true },
});

const applicantSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  answers: [answerSchema],
});

const ExitApplicant = mongoose.model("ExitApplicant", applicantSchema);
module.exports = ExitApplicant;
