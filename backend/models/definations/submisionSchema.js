// models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    applicantId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Applicants', 
        required: true 
    },
    formId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Forms', 
        required: true 
    },
    answers: [{ 
        questionId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Questions', // Optional: reference to a Questions model if needed
            required: true 
        },
        answer: { 
            type: String, 
            required: true 
        }
    }],
}, { timestamps: true });

// Create the Submission model
const Submission = mongoose.model('Submission', submissionSchema);

// Export the model
module.exports = Submission;