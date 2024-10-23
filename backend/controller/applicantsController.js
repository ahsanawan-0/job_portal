const jobModel = require("../models/jobModel");
const User = require("../models/definations/applicantsSchema");
const sendEmail = require("../helpers/sendEmail");

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
      console.log("No resume file uploaded.");
      return res.status(400).json({ error: "Resume file is required" });
    }

    const resumePath = req.file.path;

    // Check for existing user with the same email
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   console.log(`User with email ${email} already exists.`);
    //   return res.status(400).json({ error: 'Email already exists' });
    // }

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

    const updatedJob = await jobModel.applyForJob(jobId, newUser._id);
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const jobDetails = {
      title: updatedJob.jobTitle,
      company: updatedJob.company,
      location: updatedJob.location,
      experienceRequired: experience,
    };

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

module.exports = ApplicantsApplyForJob;
