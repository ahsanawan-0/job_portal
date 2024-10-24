const mongoose = require("mongoose");
const jobSchema = require("./definations/jobSchema"); // Correct path and filename

const Job = mongoose.model("Job", jobSchema);

// Create a new job
const createJob = async (jobData) => {
  try {
    const job = new Job(jobData);
    return await job.save();
  } catch (error) {
    console.error(`Error creating job: ${error.message}`);
    throw error;
  }
};

// Get jobs with pagination
const getJobsForPagination = async (limit, skip) => {
  try {
    const totalJobs = await Job.countDocuments();
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    return { jobs, totalJobs };
  } catch (error) {
    console.error(`Error fetching jobs for pagination: ${error.message}`);
    throw error;
  }
};

// Get recent jobs
const getRecentJobs = async () => {
  try {
    return await Job.find().sort({ createdAt: -1 }).limit(5);
  } catch (error) {
    console.error(`Error fetching recent jobs: ${error.message}`);
    throw error;
  }
};

// Get all jobs for count
const getAllJobsForCount = async () => {
  try {
    return await Job.find();
  } catch (error) {
    console.error(`Error fetching all jobs for count: ${error.message}`);
    throw error;
  }
};

// Get all jobs
const getAllJobs = async () => {
  try {
    return await Job.find().sort({ createdAt: -1 });
  } catch (error) {
    console.error(`Error fetching all jobs: ${error.message}`);
    throw error;
  }
};

// Get a job by ID
const getJobById = async (jobId) => {
  try {
    return await Job.findById(jobId);
  } catch (error) {
    console.error(`Error fetching job by ID: ${error.message}`);
    throw error;
  }
};

// Update a job
const updateJob = async (jobId, updateData) => {
  try {
    return await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    console.error(`Error updating job: ${error.message}`);
    throw error;
  }
};

// Delete a job
const deleteJob = async (jobId) => {
  try {
    return await Job.findByIdAndDelete(jobId);
  } catch (error) {
    console.error(`Error deleting job: ${error.message}`);
    throw error;
  }
};

// Search job posts
const searchJobPosts = async (keyword) => {
  try {
    const query = {
      $or: [
        { jobTitle: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ],
    };
    return await Job.find(query).sort({ createdAt: -1 });
  } catch (error) {
    console.error(`Error searching job posts: ${error.message}`);
    throw error;
  }
};

// Check job expiration
const checkExpiration = async (jobId) => {
  try {
    const job = await Job.findById(jobId);
    if (!job || job.expirationDate < new Date()) {
      throw new Error('The job application period has expired.');
    }
    return job;
  } catch (error) {
    console.error(`Error checking job expiration: ${error.message}`);
    throw error;
  }
};

// Apply for a job and add the applicant's ID to the job's applicants array
const applyForJob = async (jobId, applicantId) => {
  try {
    const job = await Job.findById(jobId);

    // Check if the job exists and whether it has expired
    if (!job || job.expirationDate < new Date()) {
      throw new Error('The job application period has expired.');
    }

    // If the job is not expired, proceed to add the applicant ID
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $addToSet: { applicants: applicantId } }, // Use $addToSet to avoid duplicates
      { new: true }
    );

    return updatedJob; // Return the updated job
  } catch (error) {
    console.error(`Error applying for job: ${error.message}`);
    throw error;
  }
};

// Get job title by ID
const getJobTitleById = async (jobId) => {
  try {
    // Fetch job title using jobId
    const job = await Job.findById(jobId).select('jobTitle');
    if (!job) {
      throw new Error('Job not found');
    }
    // Return the job title
    return job.jobTitle;
  } catch (error) {
    console.error(`Error fetching job title: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobTitleById,
  searchJobPosts,
  getRecentJobs,
  getJobsForPagination,
  checkExpiration,
  getAllJobsForCount,
  applyForJob, // Export the new method
};
