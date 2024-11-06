const mongoose = require("mongoose");
const jobModel = require("../models/jobModel");

module.exports = {
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

      if (minSalary > maxSalary) {
        return res
          .status(400)
          .json({ message: "Min Salary cannot be greater than Max Salary." });
      }
      const status =
        new Date(expirationDate).getTime() > new Date().getTime()
          ? "Active"
          : "Expired";

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
        status,
      };

      const newJob = await jobModel.createJob(jobData);

      res.status(201).json({
        message: "Job post created successfully.",
        job: newJob,
      });
    } catch (error) {
      console.error("Error creating job post:", error.message);
      res.status(500).json({
        message: "Failed to create job post.",
        error: error.message,
      });
    }
  },

  getJobsforPagination: async (req, res) => {
    const { page = 1, limit = 4 } = req.query;
    const skip = (page - 1) * limit;

    try {
      const { jobs, totalJobs } = await jobModel.getJobsForPagination(
        limit,
        skip
      );
      const simplifiedJobs = jobs.map((job) => ({
        id: job._id,
        jobTitle: job.jobTitle,
        noOfApplications: job.applicants.length,
        jobType: job.jobType,
        status: job.status,
        // new Date(job.expirationDate).getTime() > new Date().getTime()
        //   ? "Active"
        //   : "Expired",
        createdDate: job.createdAt,
        expirationDate: job.expirationDate,
        applicants: job.applicants,
        shortListed: job.shortListedApplicants,
        testInvitedApplicants: job.testInvitedApplicants,
        hiredApplicants: job.hiredApplicants,
      }));

      res.status(200).json({ simplifiedJobs, totalJobs });
    } catch (error) {
      console.error("Error fetching job posts:", error.message);
      res.status(500).json({
        message: "Failed to fetch job posts.",
        error: error.message,
      });
    }
  },

  getRecentJobPosts: async (req, res) => {
    try {
      const jobs = await jobModel.getRecentJobs();
      const simplifiedJobs = jobs.map((job) => ({
        id: job._id,
        jobTitle: job.jobTitle,
        noOfApplications: job.applicants.length,
        jobType: job.jobType,
        status: job.status,
        createdDate: job.createdAt,
        expirationDate: job.expirationDate,
        applicants: job.applicants,
        shortListed: job.shortListedApplicants,
        testInvitedApplicants: job.testInvitedApplicants,
        hiredApplicants: job.hiredApplicants,
      }));
      res.status(200).json({ simplifiedJobs });
    } catch (error) {
      console.error("Error fetching recent job posts:", error.message);
      res.status(500).json({
        message: "Failed to fetch recent job posts.",
        error: error.message,
      });
    }
  },

  getAllJobsForCount: async (req, res) => {
    try {
      const jobs = await jobModel.getAllJobsForCount();

      const totalJobs = jobs.length;

      const activeJobs = jobs.filter((job) => job.status === "Active").length;
      const expiredJobs = jobs.filter((job) => job.status === "Expired").length;

      const totalShortlistedApplicants = jobs.reduce((count, job) => {
        return (
          count +
          (job.shortListedApplicants ? job.shortListedApplicants.length : 0)
        );
      }, 0);
      const totalHiredApplicants = jobs.reduce((count, job) => {
        return count + (job.hiredApplicants ? job.hiredApplicants.length : 0);
      }, 0);
      res.status(200).json({
        totalJobs,
        expiredJobs,
        activeJobs,
        totalShortlistedApplicants,
        totalHiredApplicants,
      });
    } catch (error) {
      console.error("Error fetching recent job posts:", error.message);
      res.status(500).json({
        message: "Failed to fetch recent job posts.",
        error: error.message,
      });
    }
  },

  getJobPostById: async (req, res) => {
    try {
      const jobId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: "Invalid Job ID." });
      }
      const job = await jobModel.getJobById(jobId);

      if (!job) {
        return res.status(404).json({ message: "Job post not found." });
      }

      res.status(200).json({ job });
    } catch (error) {
      console.error("Error fetching job post:", error.message);
      res.status(500).json({
        message: "Failed to fetch job post.",
        error: error.message,
      });
    }
  },

  // updateJobPost: async (req, res) => {
  //   try {
  //     const jobId = req.params.id;
  //     const updateData = req.body;

  //     if (!mongoose.Types.ObjectId.isValid(jobId)) {
  //       return res.status(400).json({ message: "Invalid Job ID." });
  //     }

  //     if (
  //       updateData.minSalary !== undefined &&
  //       updateData.maxSalary !== undefined &&
  //       updateData.minSalary > updateData.maxSalary
  //     ) {
  //       return res
  //         .status(400)
  //         .json({ message: "Min Salary cannot be greater than Max Salary." });
  //     }

  //     const updatedJob = await jobModel.updateJob(jobId, updateData);

  //     if (!updatedJob) {
  //       return res.status(404).json({ message: "Job post not found." });
  //     }

  //     res.status(200).json({
  //       message: "Job post updated successfully.",
  //       job: updatedJob,
  //     });
  //   } catch (error) {
  //     console.error("Error updating job post:", error.message);
  //     res.status(500).json({
  //       message: "Failed to update job post.",
  //       error: error.message,
  //     });
  //   }
  // },

  updateJobStatus: async (req, res) => {
    try {
      const jobId = req.params.id;
      const updatedJob = jobModel.updateJobStatus(jobId);
      if (updatedJob && updatedJob.status === "Expired") {
        return res.send({
          message: "Job status updated to Expired.",
          job: updatedJob,
        });
      } else if (updatedJob) {
        return res.send({ message: "Job was already expired." });
      } else {
        return res.status(404).send({ message: "Job not found." });
      }
    } catch (error) {
      return res.send({
        error: error,
      });
    }
  },

  deleteJobPost: async (req, res) => {
    try {
      const jobId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: "Invalid Job ID." });
      }

      const deletedJob = await jobModel.deleteJob(jobId);

      if (!deletedJob) {
        return res.status(404).json({ message: "Job post not found." });
      }

      res.status(200).json({
        message: "Job post deleted successfully.",
        job: deletedJob,
      });
    } catch (error) {
      console.error("Error deleting job post:", error.message);
      res.status(500).json({
        message: "Failed to delete job post.",
        error: error.message,
      });
    }
  },

  searchJobPosts: async (req, res) => {
    try {
      const { keyword } = req.query;

      if (!keyword) {
        return res
          .status(400)
          .json({ message: "Keyword is required for search." });
      }

      const jobs = await jobModel.searchJobPosts(keyword);

      const simplifiedJobs = jobs.map((job) => ({
        id: job._id,
        jobTitle: job.jobTitle,
        noOfApplications: job.applicants.length,
        createdDate: job.createdAt,
        status:
          new Date(job.expirationDate).getTime() > new Date().getTime()
            ? "Active"
            : "Expired",
      }));

      res.status(200).json({
        count: simplifiedJobs.length,
        jobs: simplifiedJobs,
      });
    } catch (error) {
      console.error("Error searching job posts:", error.message);
      res.status(500).json({
        message: "Failed to search job posts.",
        error: error.message,
      });
    }
  },
  getHiredCandidates: async (req, res) => {
    try {
      // Call the model function to get hired candidates
      const hiredCandidates = await jobModel.getHiredCandidates();
      const totalHiredCandidates = hiredCandidates.length;

      res.status(200).json({
        message: "Hired candidates retrieved successfully.",
        hiredCandidates,
        totalHiredCandidates,
      });
    } catch (error) {
      console.error("Error fetching hired candidates:", error.message);
      res.status(500).json({
        message: "Failed to fetch hired candidates.",
        error: error.message,
      });
    }
  },
};
