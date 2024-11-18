const mongoose = require("mongoose");
const applicant = require("../models/definations/applicantsSchema");
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
      if (!jobData) {
        return {
          error: jobData.error,
        };
      }
      return {
        response: {
          applicants: jobData.applicants,
          jobTitle: jobData.jobTitle,
          expirationDate: jobData.expirationDate,
          status: jobData.status,
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

  addApplicantToTestInvited: async (jobId, applicantId) => {
    try {
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $addToSet: { testInvitedApplicants: applicantId } },
        { new: true }
      ).populate("testInvitedApplicants");

      if (!updatedJob) {
        return { error: "Failed to update test invited applicants." };
      }

      // Use the correct model name here
      const applicantData = await applicant.findById(applicantId); // Ensure proper model is referenced
      if (!applicantData) {
        return { error: "Applicant not found." };
      }

      return { job: updatedJob, applicantData };
    } catch (error) {
      return { error: error.message };
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

  createOnSiteInviteApplicants: async (jobId, applicantId) => {
    try {
      const jobData = await Job.findByIdAndUpdate(
        jobId,
        {
          $addToSet: { onSiteInvite: applicantId },
        },
        { new: true }
      ).populate("onSiteInvite");

      if (!jobData) {
        return {
          error: new Error(
            "Job not found or failed to update onsite invite list"
          ),
        };
      }

      const invitedApplicant = jobData.onSiteInvite.find(
        (applicant) => applicant._id.toString() === applicantId
      );

      return {
        response: {
          invitedApplicant,
          jobTitle: jobData.jobTitle,
          jobCompany: jobData.company,
        },
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  },

  getAllOnSiteInviteApplicants: async (jobId) => {
    try {
      const jobData = await Job.findById(jobId)
        .populate({
          path: "onSiteInvite",
          options: { sort: { createdAt: -1 } },
        })
        .exec();

      if (!jobData) {
        return {
          error: new Error("Job not found or failed to fetch data"),
        };
      }

      return {
        response: {
          invitedApplicants: jobData.onSiteInvite,
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
