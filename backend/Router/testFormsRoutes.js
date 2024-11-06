const express = require('express');
const router = express.Router();
const { createForm,getFormById,getSubmissionWithQuestions,submitForm ,getAllForms, getApplicantsByFormId} = require('../controller/TestFormController')

// Define your routes
router.post('/create_test_form', createForm);
router.get('/forms/:test_form_id', getFormById); 
router.get('/generated/forms/getAllforms', getAllForms); 
router.post('/forms/submitTest/:formId', submitForm); 
router.get('/applied-test-applicants-list/:formId', getApplicantsByFormId);
router.get('/submisions/results/:submissionId', getSubmissionWithQuestions);



module.exports = router;