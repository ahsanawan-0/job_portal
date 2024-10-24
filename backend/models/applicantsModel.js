const mongoose = require("mongoose");
const applicant = require("./definations/applicantsSchema");
const jobSchema = require("../models/definations/jobSchema");
const Job = mongoose.model("Job", jobSchema);
module.exports = {
  getAllApplications: async () => {
    try {
      const applicants = await applicant.find({});
      //   console.log("in model", applicants);
      if (applicants.error) {
        return {
          error: applicants.error,
        };
      }
      return {
        response: applicants,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  },
  getApplicantsForJob: async (jobId) => {
    try {
      const jobData = await Job.findById(jobId).populate("applicants").exec();

      //   console.log("in model", applicants);
      if (jobData.error) {
        return {
          error: jobData.error,
        };
      }
      return {
        response: {
          applicants: jobData.applicants,
          jobTitle: jobData.jobTitle,
        },
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  },

  createShortListedApplicantsForJob: async (jobId, applicantId) => {
    try {
      const addToShortListed = await Job.findByIdAndUpdate(
        jobId,
        {
          $addToSet: { shortListedApplicants: applicantId },
        },
        { new: true }
      ).populate("shortListedApplicants");

      //   console.log("in model", applicants);
      if (!addToShortListed) {
        return {
          error: addToShortListed.error,
        };
      }
      return {
        response: addToShortListed,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  },
};
