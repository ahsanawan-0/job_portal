const mongoose = require("mongoose");

const answerEvaluationSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Questions', required: true },
    givenAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, default: null },
    score: { type: Number, default: 0 },
    feedback: { type: String, default: null } 
}, { _id: false }); 

const evaluationSchema = new mongoose.Schema({
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicants', required: true }, 
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forms', required: true }, 
    correctnessPercentage: { type: Number, default: null },
    remark: { type: String, default: null },
    answerEvaluations: [answerEvaluationSchema], 
}, { timestamps: true });

module.exports = mongoose.model("Evaluation", evaluationSchema);