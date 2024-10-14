const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\S+@\S+\.\S+$/,
      'Please provide a valid email address',
    ],
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    enum: ['0-6 months', '1 year', '2 years', '3 years', '4 years', '5 years', '6 years'],
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
  },
  resume: {
    type: String, // Path to the resume file
    required: [true, 'Resume is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
