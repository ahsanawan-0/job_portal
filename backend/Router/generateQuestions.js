const {  createTest,submitAnswers} = require('../controller/generateQuestionsController');

const router=require("express").Router();


router.post('/generate_questions', createTest);
router.post('/submit_answers/:session_id', submitAnswers);


module.exports=router;



