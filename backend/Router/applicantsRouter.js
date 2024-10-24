const express = require("express");
const router = express.Router();
const applicantsController = require("../controller/applicantsController");
const upload = require("../helpers/uploadHelper");

const { getAllApplications } = require("../controller/applicantsController");

// POST route to create a user with resume upload
router.post(
  "/submit-application/:jobId",
  upload.single("resume"),
  applicantsController.ApplicantsApplyForJob
);
// routes/files.js

const { getFileById } = require('../helpers/getApplicantData'); // Adjust the path

// Route to get file by ID
router.get('/file/:fileId', async (req, res) => {
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

module.exports = router;
