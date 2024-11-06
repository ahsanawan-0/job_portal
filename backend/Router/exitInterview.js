const express = require("express");
const router = express.Router();
const {
  createExitInterviewForm,

  getAllExitInterviewForms,
  getFormById,
<<<<<<< HEAD

  submitExitInterview,
  deleteFormById,
  getApplicantsByFormId,
  getApplicantQuestionsAndAnswers,
  deleteExitApplicant,
  updateForm,
} = require("../controller/exitInterviewController");
const checkId = require("../middleweres/checkId");
=======
  getAllInterviews,
  submitFormResponses,
} = require('../controller/exitInterviewController');
const checkId = require('../middleweres/checkId');
>>>>>>> branch_4

// Route to create a new form
router.post("/create", createExitInterviewForm);

// Route to get a form by its unique link ID
<<<<<<< HEAD
// router.get("/exitInterviewForm/:id", getFormById);
=======
router.get('/:uniqueLinkId', getFormById);
router.get('/getAllInterviews/forms', getAllInterviews);
>>>>>>> branch_4

// Route to submit responses
// router.post("/submit", submitFormResponses);

router.get("/getAllExitInterviewForms/forms", getAllExitInterviewForms);
router.get("/exit-interview/:uniqueLinkId", getFormById);

router.post("/exit-interview-submit/:uniqueLinkId", submitExitInterview);
router.delete("/exit-interview-delete/:uniqueLinkId", deleteFormById);
router.get("/exit-interview-applicants/:uniqueLinkId", getApplicantsByFormId);
router.get(
  "/applicant/:applicantId/questions-answers",
  getApplicantQuestionsAndAnswers
);

router.delete(
  "/exit-interview-applicants-delete/:applicantId",
  deleteExitApplicant
);

router.put("/exit-interview-update/:uniqueLinkId", updateForm);

module.exports = router;
