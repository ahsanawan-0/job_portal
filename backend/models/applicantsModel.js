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
      const jobData = await Job.findById(jobId)
        .populate({
          path: "applicants",
          options: { sort: { createdAt: -1 } },
        })
        .exec();

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
          expirationDate: jobData.expirationDate,
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
      // console.log("in model applicantId", applicantId);
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
  getAllShortListedApplicants: async (jobId) => {
    try {
      const jobData = await Job.findById(jobId)
        .populate({
          path: "shortListedApplicants",
          options: { sort: { createdAt: -1 } },
        })
        .exec();

      //   console.log("in model", applicants);
      if (!jobData) {
        return {
          error: jobData.error,
        };
      }
      return {
        response: {
          shortListedApplicants: jobData.shortListedApplicants,
          jobTitle: jobData.jobTitle,
        },
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  },

  createTestInvitedApplicantsForJob: async (jobId, applicantId) => {
    try {
      console.log("in model test invited applicantId", applicantId);
      const addToTestInvited = await Job.findByIdAndUpdate(
        jobId,
        {
          $addToSet: { testInvitedApplicants: applicantId },
        },
        { new: true }
      ).populate("testInvitedApplicants");

      //   console.log("in model", applicants);
      if (!addToTestInvited) {
        return {
          error: addToTestInvited.error,
        };
      }
      return {
        response: addToTestInvited,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  },

  getAllTestInvitedApplicants: async (jobId) => {
    try {
      const jobData = await Job.findById(jobId)
        .populate({
          path: "testInvitedApplicants",
          options: { sort: { createdAt: -1 } },
        })
        .exec();

      // console.log("in get all test", jobData.testInvitedApplicants);
      if (!jobData) {
        return {
          error: jobData.error,
        };
      }
      return {
        response: {
          testInvitedApplicants: jobData.testInvitedApplicants,
          jobTitle: jobData.jobTitle,
        },
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  },

  createHiredApplicantsForJob: async (jobId, applicantId) => {
    try {
      console.log("in model hired applicantId", applicantId);
      const addToHired = await Job.findByIdAndUpdate(
        jobId,
        {
          $addToSet: { hiredApplicants: applicantId },
        },
        { new: true }
      ).populate("hiredApplicants");

      //   console.log("in model", applicants);
      if (!addToHired) {
        return {
          error: addToHired.error,
        };
      }
      return {
        response: addToHired,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  },

  getAllHiredApplicants: async (jobId) => {
    try {
      const jobData = await Job.findById(jobId)
        .populate({
          path: "hiredApplicants",
          options: { sort: { createdAt: -1 } },
        })
        .exec();

      // console.log("in get all test", jobData.testInvitedApplicants);
      if (!jobData) {
        return {
          error: jobData.error,
        };
      }
      return {
        response: {
          hiredApplicants: jobData.hiredApplicants,
          jobTitle: jobData.jobTitle,
        },
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  },
};
