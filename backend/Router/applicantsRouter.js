const express = require("express");
const router = express.Router();
const applicantsController = require("../controller/applicantsController");
const upload = require("../helpers/uploadHelper");

const {
  getAllApplications,
  getApplicantsForJob,
  createShortListedApplicantsForJob,
  getAllShortListedApplicants,
  createTestInvitedApplicantsForJob,
  getAllTestInvitedApplicants,
  createHiredApplicantsForJob,
  getAllHiredApplicants,
  getApplicantById,
  createOnSiteInviteApplicants,
  getAllOnSiteInviteApplicants,
} = require("../controller/applicantsController");
const { getFileById } = require("../helpers/getApplicantData"); // Adjust the path

// POST route to create a user with resume upload
router.post(
  "/submit-application/:jobId",
  upload.single("resume"),
  applicantsController.ApplicantsApplyForJob
);

router.get("/file/:fileId", async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const fileData = await getFileById(fileId);
    res.status(200).json({
      message: "File fetched successfully",
      data: fileData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getAllApplications", getAllApplications);
router.get("/getApplicantsForJob/:jobId", getApplicantsForJob);
router.post("/jobs/:jobId/shortlist", createShortListedApplicantsForJob);
router.get("/getAllShortListedApplicants/:jobId", getAllShortListedApplicants);
router.post("/jobs/:jobId/testInvite", createTestInvitedApplicantsForJob);
router.get("/getAllTestInvitedApplicants/:jobId", getAllTestInvitedApplicants);
router.post("/jobs/:jobId/hiredApplicant", createHiredApplicantsForJob);
router.get("/getAllHiredApplicants/:jobId", getAllHiredApplicants);
router.get("/applicant", getApplicantById);
router.post("/jobs/:jobId/onsiteInvite", createOnSiteInviteApplicants);
router.get("/getAllOnsiteApplicants/:jobId", getAllOnSiteInviteApplicants);

// router.get("/checkDuplicates", checkDuplicateApplications);


module.exports = router;
