const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const OptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const QuestionSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'textarea', 'radio'],
    required: true,
  },
  options: {
    type: [OptionSchema],
    default: [],
  },
});

const ExitInterviewFormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: {
    type: [QuestionSchema],
    required: true,
  },
  shareLink: {
    type: String,
    unique: true,
    default: function () {
      return uuidv4(); // Generates a unique identifier
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ExitInterviewForm', ExitInterviewFormSchema);
