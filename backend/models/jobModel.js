<<<<<<< HEAD
const mongoose = require("mongoose");
const jobSchema = require("./definations/jobSchema"); // Correct path and filename
=======
const mongoose = require('mongoose');
const jobSchema = require('./definations/jobSchema'); // Ensure the path is correct
>>>>>>> branch_4

const Job = mongoose.model("Job", jobSchema);

// Create a new job
const createJob = async (jobData) => {
  const job = new Job(jobData);
  return await job.save();
};

<<<<<<< HEAD
const getAllJobs = async (limit, skip) => {
  const totalJobs = await Job.countDocuments();

  const jobs = await Job.find()
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  return { jobs, totalJobs };
};

const getRecentJobs = async () => {
  return await Job.find().sort({ createdAt: -1 }).limit(5);
};

const getAllJobsForCount = async () => {
  return await Job.find();
=======
// Get all jobs
const getAllJobs = async () => {
  return await Job.find().sort({ createdAt: -1 });
>>>>>>> branch_4
};

// Get a job by ID
const getJobById = async (jobId) => {
  return await Job.findById(jobId);
};

// Update a job
const updateJob = async (jobId, updateData) => {
  return await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
    runValidators: true,
  });
};

// Delete a job
const deleteJob = async (jobId) => {
  return await Job.findByIdAndDelete(jobId);
};

// Search job posts
const searchJobPosts = async (keyword) => {
  const query = {
    $or: [
      { jobTitle: { $regex: keyword, $options: "i" } },
      { tags: { $regex: keyword, $options: "i" } },
    ],
  };

  return await Job.find(query).sort({ createdAt: -1 });
};

// Apply for a job and add the applicant's ID to the job's applicants array
const applyForJob = async (jobId, applicantId) => {
  // Find the job by ID
  const job = await Job.findById(jobId);

  // Check if the job exists and whether it has expired
  if (!job || job.expirationDate < new Date()) {
    throw new Error('The job application period has expired.');
  }

  // If the job is not expired, proceed to add the applicant ID
  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { $addToSet: { applicants: applicantId } }, // Use $addToSet to avoid duplicates
    { new: true } // Return the updated document
  );

  return updatedJob; // Return the updated job
};


module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobPosts,
<<<<<<< HEAD
  getRecentJobs,
  getAllJobsForCount,
=======
  applyForJob, // Export the new method
>>>>>>> branch_4
};
