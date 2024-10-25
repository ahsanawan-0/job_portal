const express = require('express');
const router = express.Router();
const { createTest, getAllQuestions, deleteQuestion } = require('../controller/generateQuestionsController')

// Define your routes
router.post('/generate_questions', createTest);
router.get('/tests/:test_id/questions', getAllQuestions); // Route for getting all questions
router.delete('/tests/:test_id/questions/:question_index', deleteQuestion); // Route for deleting a specific question

module.exports = router;