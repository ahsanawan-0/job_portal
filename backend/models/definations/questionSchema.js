const mongoose = require("mongoose");
 
const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true }, 
    correctAnswer:{ type: String, default: null },
  },
);

const Question = new mongoose.Schema(
  {
    job_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true
    },
    num_questions: { type: Number, required: true },
    interview_type: { type: String, required: true },
    experience_level: { type: String, required: true },
    field: { type: String, required: true },
    interview_time: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

const Test = mongoose.model("Question", Question);
module.exports = Test;
