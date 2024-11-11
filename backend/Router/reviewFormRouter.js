router = require("express").Router();
const {
  createReviewFormForm,
  getAllReviewForms,
  getReviewFormById,
  deleteReviewFormById,
  updateForm,
  submitReviewForm,
  getApplicantsByFormId,
  getApplicantQuestionsAndAnswers,
  deleteReviewApplicant,
} = require("../controller/reviewFormController");

router.post("/reviewForm/create", createReviewFormForm);
router.get("/reviewForm/getAllForms", getAllReviewForms);
router.get("/reviewForm/byId/:uniqueLinkId", getReviewFormById);
router.delete("/reviewForm/delete/:uniqueLinkId", deleteReviewFormById);
router.put("/reviewForm/update", updateForm);
router.post("/reviewForm/:uniqueLinkId", submitReviewForm);
router.get("/reviewForm/applicants/:uniqueLinkId", getApplicantsByFormId);
router.get(
  "/reviewForm/applicant-answers/:applicantId",
  getApplicantQuestionsAndAnswers
);

router.delete(
  "/reviewForm/applicant-delete/:applicantId",
  deleteReviewApplicant
);

module.exports = router;
