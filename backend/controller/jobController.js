// controllers/jobController.js
const mongoose = require('mongoose'); // Add this line
const jobModel = require('../models/jobModel');
module.exports={



// Create a new job post
createJobPost: async (req, res) => {
  try {
    const {
      jobTitle,
      tags,
      location,
      minSalary,
      maxSalary,
      education,
      experience,
      jobType,
      vacancies, // ensure this matches your model
      expirationDate,
      description,
      responsibilities,
    } = req.body;

    // Basic validation
    if (
      !jobTitle ||
      maxSalary === undefined ||
      minSalary === undefined ||
      !tags ||
      !education ||
      experience === undefined ||
      !jobType ||
      !expirationDate ||
      vacancies === undefined || // ensure this matches your model
      !description ||
      !responsibilities
    ) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Additional validation
    if (minSalary > maxSalary) {
      return res.status(400).json({ message: 'Min Salary cannot be greater than Max Salary.' });
    }

    const jobData = {
      jobTitle,
      tags,
      location,
      minSalary,
      maxSalary,
      education,
      experience, // ensure your model accepts this string format
      jobType,
      vacancies, // change this to match your model
      expirationDate,
      description,
      responsibilities,
    };

    const newJob = await jobModel.createJob(jobData);

    res.status(201).json({
      message: '✅ Job post created successfully!',
      job: newJob,
    });
  } catch (error) {
    console.error('❌ Error creating job post:', error.message);
    res.status(500).json({
      message: '❌ Failed to create job post',
      error: error.message,
    });
  }
},


// Get all job posts
 getAllJobPosts : async (req, res) => {
  try {
    const jobs = await jobModel.getAllJobs();
    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error('❌ Error fetching job posts:', error.message);
    res.status(500).json({
      message: '❌ Failed to fetch job posts',
      error: error.message,
    });
  }
},

// Get a single job post by ID
 getJobPostById : async (req, res) => {
  try {
    const jobId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid Job ID.' });
    }

    const job = await jobModel.getJobById(jobId);

    if (!job) {
      return res.status(404).json({ message: '❌ Job post not found' });
    }

    res.status(200).json({ job });
  } catch (error) {
    console.error('❌ Error fetching job post:', error.message);
    res.status(500).json({
      message: '❌ Failed to fetch job post',
      error: error.message,
    });
  }
},

// Update a job post by ID
 updateJobPost : async (req, res) => {
  try {
    const jobId = req.params.id;
    const updateData = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid Job ID.' });
    }

    // Optional: Validate that minSalary <= maxSalary if both are being updated
    if (
      (updateData.minSalary !== undefined && updateData.maxSalary !== undefined) &&
      updateData.minSalary > updateData.maxSalary
    ) {
      return res.status(400).json({ message: 'Min Salary cannot be greater than Max Salary.' });
    }

    const updatedJob = await jobModel.updateJob(jobId, updateData);

    if (!updatedJob) {
      return res.status(404).json({ message: '❌ Job post not found' });
    }

    res.status(200).json({
      message: '✅ Job post updated successfully!',
      job: updatedJob,
    });
  } catch (error) {
    console.error('❌ Error updating job post:', error.message);
    res.status(500).json({
      message: '❌ Failed to update job post',
      error: error.message,
    });
  }
},

// Delete a job post by ID
 deleteJobPost : async (req, res) => {
  try {
    const jobId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid Job ID.' });
    }

    const deletedJob = await jobModel.deleteJob(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: '❌ Job post not found' });
    }

    res.status(200).json({
      message: '✅ Job post deleted successfully!',
      job: deletedJob,
    });
  } catch (error) {
    console.error('❌ Error deleting job post:', error.message);
    res.status(500).json({
      message: '❌ Failed to delete job post',
      error: error.message,
    });
  }
}
}
