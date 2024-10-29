const express = require("express");
const router = express.Router();
const {
  createExitInterviewForm,

  getAllExitInterviewForms,
  getFormById,

  submitExitInterview,
} = require("../controller/exitInterviewController");
const checkId = require("../middleweres/checkId");

// Route to create a new form
router.post("/create", createExitInterviewForm);

// Route to get a form by its unique link ID
// router.get("/exitInterviewForm/:id", getFormById);

// Route to submit responses
// router.post("/submit", submitFormResponses);

router.get("/getAllExitInterviewForms/forms", getAllExitInterviewForms);
router.get("/exit-interview/:uniqueLinkId", getFormById);

router.post("/exit-interview-submit/:uniqueLinkId", submitExitInterview);

module.exports = router;
