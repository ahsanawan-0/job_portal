router = require("express").Router();
const {
  createReviewFormForm,
  getAllReviewForms,
  getReviewFormById,
  deleteReviewFormById,
} = require("../controller/reviewFormController");

router.post("/reviewForm/create", createReviewFormForm);
router.get("/reviewForm/getAllForms", getAllReviewForms);
router.get("/reviewForm/byId/:uniqueLinkId", getReviewFormById);
router.delete("/reviewForm/delete/:uniqueLinkId", deleteReviewFormById);

module.exports = router;
