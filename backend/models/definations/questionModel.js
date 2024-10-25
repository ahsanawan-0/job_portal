const mongoose = require('mongoose');

// Define the evaluation schema
const evaluationSchema = new mongoose.Schema({
    correctnessPercentage: { type: Number, default: null },
    remark: { type: String, default: null }
}, { _id: false });

// Define the question schema
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true }, // Array of options for the MCQ
    answer: { type: String, default: null },
    evaluation: { type: evaluationSchema, default: {} }
}, { _id: false });

// Define the test schema
const testSchema = new mongoose.Schema({
    num_questions: { type: Number, required: true },
    interview_type: { type: String, required: true },
    experience_level: { type: String, required: true },
    field: { type: String, required: true },
    interview_time: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
    createdAt: { type: Date, default: Date.now }
}, {
    versionKey: false
});

// Export the model
const Test = mongoose.model('Test', testSchema);
module.exports = Test;