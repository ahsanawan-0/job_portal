const express = require('express');
const router = express.Router();
const { createTest,getFormById,getTestByJobId,updateForm,submitForm ,getAllForms, getApplicantsByFormId, getEvaluationBySubmissionId} = require('../controller/TestFormController')


router.post('/create_test_form/:generatedQuestions_id/:job_id', createTest);
router.get('/forms/:test_form_id', getFormById); 
router.get('/generated/forms/getAllforms', getAllForms); 
router.post('/forms/submitTest/:formId', submitForm); 
router.get('/applied-test-applicants-list/:formId', getApplicantsByFormId);
// router.get('/submisions/results/:submissionId', getSubmissionWithQuestions);
router.put('/update_test_form/:test_id',updateForm ); 
router.get('/view/answers/:submissionId/:applicantId', getEvaluationBySubmissionId);
router.get('/tests/:jobId', getTestByJobId);




module.exports = router;