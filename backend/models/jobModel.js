// models/jobModel.js
const mongoose = require('mongoose');
const jobSchema = require('./definations/jobSchema'); // Corrected path and filename

// Create the Job model
const Job = mongoose.model('Job', jobSchema);

// Create a new job post
const createJob = async (jobData) => {
  const job = new Job(jobData);
  return await job.save();
};

// Retrieve all job posts
const getAllJobs = async () => {
  return await Job.find().sort({ createdAt: -1 });
};

// Retrieve a single job post by ID
const getJobById = async (jobId) => {
  return await Job.findById(jobId);
};

// Update a job post by ID
const updateJob = async (jobId, updateData) => {
  return await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
    runValidators: true,
  });
};

// Delete a job post by ID
const deleteJob = async (jobId) => {
  return await Job.findByIdAndDelete(jobId);
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};
