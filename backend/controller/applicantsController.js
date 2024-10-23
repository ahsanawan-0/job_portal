const User = require("../models/definations/applicantsSchema");
const jobModel = require("../models/jobModel"); // Import job model
const sendEmail = require("../helpers/sendEmail"); // Import sendEmail function
const applicantModel = require("../models/applicantsModel");

// Create a new user and store resume and cover letter
const ApplicantsApplyForJob = async (req, res) => {
  try {
    const { name, email, experience, coverLetter } = req.body; // Remove jobId from request body
    const jobId = req.params.jobId; // Get jobId from URL parameters

    // Check for jobId
    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    // Check if a file was uploaded
    if (!req.file) {
      console.log("No resume file uploaded.");
      return res.status(400).json({ error: "Resume file is required" });
    }

    const resumePath = req.file.path;

    // Check for existing user with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User with email ${email} already exists.`);
      return res.status(400).json({ error: "Email already exists" });
    }

    const newUser = new User({
      name,
      email,
      experience,
      coverLetter,
      resume: resumePath,
      jobId,
    });

    await newUser.save();
    console.log(`User ${name} with email ${email} created successfully.`);

    // Apply for the job and update the applicants list
    const updatedJob = await jobModel.applyForJob(jobId, newUser._id);
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prepare job application details
    const job = {
      title: updatedJob.jobTitle, // Ensure you access the correct property
      company: updatedJob.company, // Ensure this exists in your job schema
      location: updatedJob.location, // Ensure this exists in your job schema
      experienceRequired: experience,
    };

    // Send application email
    try {
      console.log("Calling sendEmail function.");
      await sendEmail(newUser, job);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res
        .status(500)
        .json({ error: "User created, but email sending failed" });
    }

    res.status(201).json({
      message: "User created and applied for the job successfully",
      data: newUser,
      jobDetails: job, // Include job details in response for clarity
    });
  } catch (error) {
    console.error("Error creating user:", error); // Log the error for debugging
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

module.exports = {
  ApplicantsApplyForJob,
  getAllApplications,
};
