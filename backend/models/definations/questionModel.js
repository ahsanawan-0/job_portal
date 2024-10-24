const mongoose = require('mongoose');

// Define the evaluation schema
const evaluationSchema = new mongoose.Schema({
    correctnessPercentage: { type: Number, default: null },
    remark: { type: String, default: null }
}, { _id: false }); // Disable _id for subdocuments

// Define the question schema
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true }, // The question text
    answer: { type: String, default: null },    // The user's answer
    evaluation: { type: evaluationSchema, default: {} } // Evaluation results
}, { _id: false }); // Disable _id for subdocuments

// Define the test schema
const testSchema = new mongoose.Schema({
    num_questions: { type: Number, required: true },
    interview_type: { type: String, required: true },
    experience_level: { type: String, required: true },
    field: { type: String, required: true },
    interview_time: { type: String, required: true },
    questions: { 
        type: [questionSchema],  // Store questions as an array of objects
        required: true 
    },
    createdAt: { type: Date, default: Date.now },  // Automatically set the creation date
}, {
    versionKey: false // Optional: Disable the __v field
});

// Export the model
const Test = mongoose.model('Test', testSchema);
module.exports = Test;
