const express = require('express');
const router = express.Router();
const { createForm,getFormById,updateForm,submitForm ,getAllForms, getApplicantsByFormId, getEvaluationBySubmissionId} = require('../controller/TestFormController')


router.post('/create_test_form/:generatedQuestions_id/:job_id', createForm);
router.get('/forms/:test_form_id', getFormById); 
router.get('/generated/forms/getAllforms', getAllForms); 
router.post('/forms/submitTest/:formId', submitForm); 
router.get('/applied-test-applicants-list/:formId', getApplicantsByFormId);
// router.get('/submisions/results/:submissionId', getSubmissionWithQuestions);
router.put('/update_test_form/:test_id',updateForm ); 
router.get('/view/answers/:submissionId/:applicantId', getEvaluationBySubmissionId);





module.exports = router;