const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, default: null },
});

const TestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
    duration: { type: Number, required: true },
    evaluations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' }] ,
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applicants', default: [] }], 
    generatedQuestions_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question',
        required: true, 
    },
    job_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job',
        required: true, 
    },


}, {
    timestamps: true
});

const Form = mongoose.model('testForm', TestSchema);
module.exports = Form;