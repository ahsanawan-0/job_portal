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

// Define a method to search jobs
const searchJobPosts = async (keyword) => {
  const query = {
    $or: [
      { jobTitle: { $regex: keyword, $options: 'i' } }, // Search in jobTitle
      { tags: { $regex: keyword, $options: 'i' } }    // Search in tags array
    ]
  };

  return await Job.find(query).sort({ createdAt: -1 });
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

// Method to apply for a job
const applyForJob = async (jobId, applicantId) => {
  return await Job.findByIdAndUpdate(
    jobId,
    { $addToSet: { applicants: applicantId } }, // Add applicantId to applicants array
    { new: true, runValidators: true }
  );
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob, // Export the applyForJob function
  searchJobPosts, // Export the searchJobPosts function
};
