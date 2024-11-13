const jobModel = require("../models/jobModel"); 
const mongoose = require('mongoose');
const sendEmail = require("../helpers/sendEmail"); 
const applicantModel = require("../models/applicantsModel");
const applicantsSchema = require("../models/definations/applicantsSchema");
const { uploadFile } = require('../helpers/fileHelper'); 
const { sendTestInviteEmail } = require("../helpers/testInvite");
const jobSchema = require("../models/definations/jobSchema");

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

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const resumeId = await uploadFile(req.file.path, req.file.mimetype, folderId);
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

    // console.log("sjdbnkjasd", newUser);
    await newApplicant.save();
    console.log(`User ${name} with email ${email} created successfully.`);

    const updatedJob = await jobModel.applyForJob(jobId, newApplicant._id);
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const jobDetails = {
      title: job.jobTitle,
      company: "SDSOL TECHNOLOGIES",
      location: job.location,
      experienceRequired: experience,
    };

    try {
      console.log("Calling sendEmail function.");
      await sendEmail(newApplicant, jobDetails);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res
        .status(500)
        .json({ error: "User created, but email sending failed" });
    }

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

const getApplicantsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.send({
        message: "Job Id is required",
      });
    }

    const applicantsData = await applicantModel.getApplicantsForJob(jobId);
    const totalApplicants = applicantsData.response.applicants.length;
    // console.log("in controller", applicantsData);
    if (applicantsData.error) {
      return res.send({
        error: applicantsData.error,
      });
    }
    return res.send({
      message: "All Applicants for the Job",
      response: applicantsData.response,
      totalApplicants: totalApplicants,
    });
  } catch (error) {
    return res.send({
      error: error,
    });
  }
};

const createShortListedApplicantsForJob = async (req, res) => {
  try {
    const { applicantId } = req.body;
    // console.log("in controller applicantId", applicantId);
    const jobId = req.params.jobId;
    // console.log("in controller jobid", jobId);
    if (!jobId || !applicantId) {
      return res.send({
        message: "job id and applicant id is required",
      });
    }
    const result = await applicantModel.createShortListedApplicantsForJob(
      jobId,
      applicantId
    );
    if (result.error) {
      return res.send({
        message: result.error,
      });
    }
    return res.send({
      message: "Short Listed Candidates",
      response: result.response.shortListedApplicants,
    });
  } catch (error) {
    return res.send({
      error: error,
    });
  }
};

const getAllShortListedApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.send({
        message: "Job Id is required",
      });
    }
    const shortListedData = await applicantModel.getAllShortListedApplicants(
      jobId
    );
    const totalShortListedApplicants =
      shortListedData.response.shortListedApplicants.length;
    if (shortListedData.error) {
      return res.send({
        error: shortListedData.error,
      });
    }
    return res.send({
      message: "All Short Listed Applicants for the Job",
      response: shortListedData.response,
      totalApplicants: totalShortListedApplicants,
    });
  } catch (error) {
    return res.send({
      error: error,
    });
  }
};


const createTestInvitedApplicantsForJob = async (req, res) => {
  try {
    const { applicantId, testId } = req.body;
    console.log(req.body);
    const jobId = req.params.jobId;

    // Validate input parameters
    if (!jobId || !applicantId || !testId) {
      return res.status(400).send({ message: "Job ID, Applicant ID, and Test ID are required." });
    }

    // Add applicant to the invited list
    const result = await applicantModel.addApplicantToTestInvited(jobId, applicantId);
    if (result.error) {
      return res.status(500).send({ message: result.error });
    }

    const { job, applicantData } = result; // Destructure the response
    const testLink = `${process.env.FRONTEND_URL}/test/user/${testId}?applicant=${applicantId}`;

    // Check if applicant data exists
    if (!applicantData || !applicantData.email) {
      return res.status(400).send({ message: "Applicant email not found." });
    }

    // Fetch the job title using the new function
    const jobTitle = await jobModel.getJobTitleById(jobId);
    if (!jobTitle) {
      return res.status(404).send({ message: "Job not found." });
    }

    // Send the test invitation email
    await sendTestInviteEmail(applicantData, jobTitle, testLink);

    return res.send({
      message: "Test invitation sent successfully.",
      response: job, // Return the job object
    });
  } catch (error) {
    console.error("Error inviting applicant for test:", error);
    return res.status(500).send({ error: error.message });
  }
};

const getAllTestInvitedApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.send({
        message: "Job Id is required",
      });
    }
    const testInvitedData = await applicantModel.getAllTestInvitedApplicants(
      jobId
    );

    const totalTestInvitedApplicants =
      testInvitedData.response.testInvitedApplicants.length;
    if (testInvitedData.error) {
      return res.send({
        error: testInvitedData.error,
      });
    }
    return res.send({
      message: "All Test Invited Applicants for the Job",
      response: testInvitedData.response,
      totalApplicants: totalTestInvitedApplicants,
    });
  } catch (error) {
    return res.send({
      error: error,
    });
  }
};

const createHiredApplicantsForJob = async (req, res) => {
  try {
    const { applicantId } = req.body;
    console.log("in controller applicantId", applicantId);
    const jobId = req.params.jobId;
    console.log("in controller jobid", jobId);
    if (!jobId || !applicantId) {
      return res.send({
        message: "job id and applicant id is required",
      });
    }
    const result = await applicantModel.createHiredApplicantsForJob(
      jobId,
      applicantId
    );
    if (result.error) {
      return res.send({
        message: result.error,
      });
    }
    return res.send({
      message: "Hired Candidate",
      response: result.response.addToHired,
    });
  } catch (error) {
    return res.send({
      error: error,
    });
  }
};

const getAllHiredApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.send({
        message: "Job Id is required",
      });
    }
    const HiredData = await applicantModel.getAllHiredApplicants(jobId);

    const totalHiredApplicants = HiredData.response.hiredApplicants.length;
    if (HiredData.error) {
      return res.send({
        error: HiredData.error,
      });
    }
    return res.send({
      message: "All Hired Applicants for the Job",
      response: HiredData.response,
      totalApplicants: totalHiredApplicants,
    });
  } catch (error) {
    return res.send({
      error: error,
    });
  }
};
const getApplicantById = async (req, res) => {
  try {
      // Get applicantId from the query parameters
      const { applicant } = req.query; // Use req.query to access query parameters

      if (!applicant) {
          return res.status(400).json({ error: "Applicant ID is required." });
      }

      // Ensure that applicant is a valid ObjectId format
      if (!mongoose.Types.ObjectId.isValid(applicant)) {
          return res.status(400).json({ error: "Invalid Applicant ID format." });
      }
console.log(applicant)
      // Find the applicant by ID and select only the name and email fields
      const applicantData = await applicantsSchema.findById(applicant).select('name email');

      if (!applicantData) {
          return res.status(404).json({ error: "Applicant not found." });
      }

      // Return the applicant's name and email
      res.status(200).json({
          message: "Applicant data retrieved successfully.",
          data: applicantData,
      });
  } catch (error) {
      console.error("Error fetching applicant data:", error);
      res.status(500).json({ error: "An error occurred while fetching applicant data." });
  }
}

module.exports = {
  ApplicantsApplyForJob,
  getAllApplications,
  getApplicantsForJob,
  createShortListedApplicantsForJob,
  getAllShortListedApplicants,
  createTestInvitedApplicantsForJob,
  getAllTestInvitedApplicants,
  createHiredApplicantsForJob,
  getAllHiredApplicants,
  getApplicantById,
};
