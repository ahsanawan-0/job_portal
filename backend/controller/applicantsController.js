const jobModel = require("../models/jobModel"); // Adjust the path as needed
const sendEmail = require("../helpers/sendEmail"); // Adjust the path as needed
const applicantModel = require("../models/applicantsModel");
const applicantsSchema = require("../models/definations/applicantsSchema");
const { uploadFile } = require('../helpers/fileHelper'); // Import the helper function

const ApplicantsApplyForJob = async (req, res) => {
  try {
    const { name, email, experience, coverLetter } = req.body;
    const jobId = req.params.jobId;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    try {
      await jobModel.checkExpiration(jobId);
    } catch (expirationError) {
      return res.status(400).json({ error: "This job has expired" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const folderId = '1aRPTiKq40lw-MOR5QJ7hDNtnSh8jNxXc';

    // Upload the resume to Google Drive
    const resumeId = await uploadFile(req.file.path, req.file.mimetype, folderId);

    // Optionally upload a profile photo if provided
    let profilePhotoId = null;
    if (req.body.profilePhoto) {
      profilePhotoId = await uploadFile(req.body.profilePhoto.path, req.body.profilePhoto.mimetype, folderId);
    }

    const job = await jobModel.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const existingApplication = await applicantsSchema.findOne({
      email,
      appliedJobs: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied for this job." });
    }

    const newApplicant = new applicantsSchema({
      name,
      email,
      experience,
      coverLetter,
      resume: resumeId, // Store Google Drive ID
      profilePhoto: profilePhotoId, // Store profile photo ID if provided
      jobTitle: job.jobTitle,
      appliedJobs: [jobId],
    });

    await newApplicant.save();
    await jobModel.applyForJob(jobId, newApplicant._id);

    const jobDetails = {
      title: job.jobTitle,
      company: "SDSOL TECHNOLOGIES",
      location: job.location,
      experienceRequired: experience,
    };

    await sendEmail(newApplicant, jobDetails);

    res.status(201).json({
      message: "User created and applied for the job successfully",
      data: newApplicant,
      jobDetails: jobDetails,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applicants = await applicantModel.getAllApplications();
    const totalApplicants = applicants.response.length;
    if (applicants.error) {
      return res.send({
        error: applicants.error,
      });
    }
    return res.send({
      message: "All Applicants",
      response: applicants.response,
      totalApplicants: totalApplicants,
    });
  } catch (error) {
    return res.send({
      error: error,
    });
  }
};

module.exports = { ApplicantsApplyForJob, getAllApplications };