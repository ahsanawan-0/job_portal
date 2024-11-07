const express = require('express');
const router = express.Router();
const { createQuestions, deleteGeneratedQuestion, getQuestionsById, getAllGeneratedQuestions, } = require('../controller/TestQuestionsController')

// Define your routes
router.post('/generate_questions', createQuestions);
router.get('/questions/:generatedQuestions_id',getQuestionsById );
router.get('/generated_questions/getAllQuestions', getAllGeneratedQuestions); 
router.delete('/generated_questions/:generatedQuestions_id',deleteGeneratedQuestion  ); 
// router.delete('/questions/:generatedQuestions_id/:question_index', deleteQuestion); 
module.exports = router;