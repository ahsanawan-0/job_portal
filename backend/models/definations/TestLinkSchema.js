// models/TestLink.js
const mongoose = require('mongoose');

const TestLinkSchema = new mongoose.Schema({
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'testForm', required: true },
    token: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('testLink', TestLinkSchema);