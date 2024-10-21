const mongoose = require("mongoose"); // Add this line
const jobModel = require("../models/jobModel");

module.exports = {
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
        vacancies,
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
        vacancies === undefined ||
        !description ||
        !responsibilities
      ) {
        return res
          .status(400)
          .json({ message: "Please fill all required fields." });
      }

      // Additional validation
      if (minSalary > maxSalary) {
        return res
          .status(400)
          .json({ message: "Min Salary cannot be greater than Max Salary." });
      }

      const jobData = {
        jobTitle,
        tags,
        location,
        minSalary,
        maxSalary,
        education,
        experience,
        jobType,
        vacancies,
        expirationDate,
        description,
        responsibilities,
      };

      const newJob = await jobModel.createJob(jobData);

      res.status(201).json({
        message: "✅ Job post created successfully!",
        job: newJob,
      });
    } catch (error) {
      console.error("❌ Error creating job post:", error.message);
      res.status(500).json({
        message: "❌ Failed to create job post",
        error: error.message,
      });
    }
  },

  // Get all job posts
  getAllJobPosts: async (req, res) => {
    try {
      const jobs = await jobModel.getAllJobs();
      const simplifiedJobs = jobs.map((job) => ({
        id: job._id,
        jobTitle: job.jobTitle,
        jobType: job.jobType,
        expirationDate: job.expirationDate,
        noOfApplications: job.applicants.length, // Count of applicants
        status: job.expirationDate > new Date() ? "Active" : "Inactive", // Set status based on expiration date
        createdDate: job.createdAt, // Created date from timestamps
      }));
      res.status(200).json({
        count: jobs.length,
        simplifiedJobs,
      });
    } catch (error) {
      console.error("❌ Error fetching job posts:", error.message);
      res.status(500).json({
        message: "❌ Failed to fetch job posts",
        error: error.message,
      });
    }
  },

  // Get a single job post by ID
  getJobPostById: async (req, res) => {
    try {
      const jobId = req.params.id;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: "Invalid Job ID." });
      }

      const job = await jobModel.getJobById(jobId);

      if (!job) {
        return res.status(404).json({ message: "❌ Job post not found" });
      }

      res.status(200).json({ job });
    } catch (error) {
      console.error("❌ Error fetching job post:", error.message);
      res.status(500).json({
        message: "❌ Failed to fetch job post",
        error: error.message,
      });
    }
  },

  // Update a job post by ID
  updateJobPost: async (req, res) => {
    try {
      const jobId = req.params.id;
      const updateData = req.body;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: "Invalid Job ID." });
      }

      // Optional: Validate that minSalary <= maxSalary if both are being updated
      if (
        updateData.minSalary !== undefined &&
        updateData.maxSalary !== undefined &&
        updateData.minSalary > updateData.maxSalary
      ) {
        return res
          .status(400)
          .json({ message: "Min Salary cannot be greater than Max Salary." });
      }

      const updatedJob = await jobModel.updateJob(jobId, updateData);

      if (!updatedJob) {
        return res.status(404).json({ message: "❌ Job post not found" });
      }

      res.status(200).json({
        message: "✅ Job post updated successfully!",
        job: updatedJob,
      });
    } catch (error) {
      console.error("❌ Error updating job post:", error.message);
      res.status(500).json({
        message: "❌ Failed to update job post",
        error: error.message,
      });
    }
  },

  // Delete a job post by ID
  deleteJobPost: async (req, res) => {
    try {
      const jobId = req.params.id;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: "Invalid Job ID." });
      }

      const deletedJob = await jobModel.deleteJob(jobId);

      if (!deletedJob) {
        return res.status(404).json({ message: "❌ Job post not found" });
      }

      res.status(200).json({
        message: "✅ Job post deleted successfully!",
        job: deletedJob,
      });
    } catch (error) {
      console.error("❌ Error deleting job post:", error.message);
      res.status(500).json({
        message: "❌ Failed to delete job post",
        error: error.message,
      });
    }
  },

  searchJobPosts: async (req, res) => {
    try {
      const { keyword } = req.query; // Expecting a single keyword

      if (!keyword) {
        return res
          .status(400)
          .json({ message: "Keyword is required for search." });
      }

      const jobs = await jobModel.searchJobPosts(keyword); // Pass the keyword for the search

      // Map the jobs to include only the required fields
      const simplifiedJobs = jobs.map((job) => ({
        id: job._id,
        jobTitle: job.jobTitle,
        noOfApplications: job.applicants.length, // Count of applicants
        status: job.expirationDate > new Date() ? "Active" : "Inactive", // Set status based on expiration date
        createdDate: job.createdAt, // Created date from timestamps
      }));

      res.status(200).json({
        count: simplifiedJobs.length,
        jobs: simplifiedJobs,
      });
    } catch (error) {
      console.error("❌ Error searching job posts:", error.message);
      res.status(500).json({
        message: "❌ Failed to search job posts",
        error: error.message,
      });
    }
  },
};
