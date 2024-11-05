const express = require('express');
const router = express.Router();
const { createQuestions, deleteGeneratedQuestion, deleteQuestion, getQuestionsById, getAllGeneratedQuestions, } = require('../controller/TestQuestionsController')

// Define your routes
router.post('/generate_questions', createQuestions);
router.get('/questions/:question_id',getQuestionsById );
router.get('/generated_questions/getAllQuestions', getAllGeneratedQuestions); 
router.delete('/generated_questions/:question_id',deleteGeneratedQuestion  ); 
router.delete('/questions/:question_id/:question_index', deleteQuestion); 
module.exports = router;