const express = require('express');
const router = express.Router();
const {
  createExitInterviewForm,
  getFormById,
  submitFormResponses,
} = require('../controller/exitInterviewController');
const checkId = require('../middleweres/checkId');

// Route to create a new form
router.post('/create' , createExitInterviewForm);

// Route to get a form by its unique link ID
router.get('/:id', getFormById);

// Route to submit responses
router.post('/submit', submitFormResponses);

module.exports = router;
