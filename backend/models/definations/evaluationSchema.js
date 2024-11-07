
const mongoose = require("mongoose");

const answerEvaluationSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Questions', required: true },
    givenAnswer: { type: String, required: true },
    correctnessPercentage: { type: Number, default: null },
    remarks: { type: String, default: null },
    feedback: { type: String, default: null } 
}, { _id: false }); 

const evaluationSchema = new mongoose.Schema({
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicants', required: true }, 
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forms', required: true }, 
    submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true }, 
    answerEvaluations: [answerEvaluationSchema], 
}, { timestamps: true });

module.exports = mongoose.model("Evaluation", evaluationSchema);