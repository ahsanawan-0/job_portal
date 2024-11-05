const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, default: null },
});

const formSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
    duration: { type: Number, required: true },
    evaluations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' }] ,
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applicants', default: [] }], 

}, {
    timestamps: true
});

const Form = mongoose.model('testForms', formSchema);
module.exports = Form;