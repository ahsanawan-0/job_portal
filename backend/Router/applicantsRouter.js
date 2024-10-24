const express = require("express");
const router = express.Router();
const applicantsController = require("../controller/applicantsController");
const upload = require("../helpers/fileHelper");

const {
  getAllApplications,
  getApplicantsForJob,
  createShortListedApplicantsForJob,
} = require("../controller/applicantsController");

// POST route to create a user with resume upload
router.post(
  "/submit-application/:jobId",
  upload.single("resume"),
  applicantsController.ApplicantsApplyForJob
);

router.get("/getAllApplications", getAllApplications);
router.get("/getApplicantsForJob/:jobId", getApplicantsForJob);
router.post("/jobs/:jobId/shortlist", createShortListedApplicantsForJob);

module.exports = router;
