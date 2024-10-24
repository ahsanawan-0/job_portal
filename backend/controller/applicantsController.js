const jobModel = require("../models/jobModel"); // Adjust the path as needed
const User = require("../models/definations/applicantsSchema"); // Adjust the path as needed
const sendEmail = require("../helpers/sendEmail"); // Adjust the path as needed
const applicantModel = require("../models/applicantsModel");

const ApplicantsApplyForJob = async (req, res) => {
  try {
    const { name, email, experience, coverLetter } = req.body;
    const jobId = req.params.jobId; // Get jobId from URL parameters

    // Check for jobId
    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    // Validate job expiration date using jobModel function
    try {
      await jobModel.checkExpiration(jobId);
    } catch (expirationError) {
      return res.status(400).json({ error: "This job has expired" });
    }

    // Check if a file was uploaded
    if (!req.file) {
      console.log("No resume file uploaded.");
      return res.status(400).json({ error: "Resume file is required" });
    }

    const resumePath = req.file.path;

    // Retrieve job details from jobModel
    const job = await jobModel.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const newUser = new User({
      name,
      email,
      experience,
      coverLetter,
      resume: resumePath,
      jobTitle: job.jobTitle,
    });

    console.log("sjdbnkjasd", newUser);
    await newUser.save();
    console.log(`User ${name} with email ${email} created successfully.`);

    // Apply for the job and update the applicants list using jobModel
    const updatedJob = await jobModel.applyForJob(jobId, newUser._id);
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prepare job application details
    const jobDetails = {
      title: updatedJob.jobTitle,
      company: updatedJob.company,
      location: updatedJob.location,
      experienceRequired: experience,
    };

    // Send application email
    try {
      console.log("Calling sendEmail function.");
      await sendEmail(newUser, jobDetails);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res
        .status(500)
        .json({ error: "User created, but email sending failed" });
    }

    res.status(201).json({
      message: "User created and applied for the job successfully",
      data: newUser,
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
    const jobId = req.params.jobId;
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
      response: result.response,
    });
  } catch (error) {
    return res.send({
      error: error,
    });
  }
};

module.exports = {
  ApplicantsApplyForJob,
  getAllApplications,
  getApplicantsForJob,
  createShortListedApplicantsForJob,
};
