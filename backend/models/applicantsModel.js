const mongoose = require("mongoose");
const applicant = require("../models/definations/applicantsSchema");
const Job = require("../models/definations/jobSchema");
// const Job = mongoose.model("Job", jobSchema);
module.exports = {
  getAllApplications: async () => {
    try {
      const applicants = await applicant.find({});
   
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

    if (!jobData) {
      return {
        error: "Job not found",
      };
    }

    // Map applicants and filter their applications
    const applicants = jobData.applicants.map(applicant => ({
      _id: applicant._id,
      email: applicant.email,
      applications: applicant.applications.filter(application => 
        application.jobId.toString() === jobId
      ),
    })).filter(applicant => applicant.applications.length > 0); // Only include applicants with matching applications

    return {
      response: {
        applicants: applicants,
        jobTitle: jobData.jobTitle,
        expirationDate: jobData.expirationDate,
        status: jobData.status,
      },
    };
  } catch (error) {
    return {
      error: error.message,
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
  
      if (!jobData) {
        return {
          error: "Job not found",
        };
      }
  
      // Map shortlisted applicants and filter their applications
      const shortListedApplicants = jobData.shortListedApplicants.map(applicant => ({
        _id: applicant._id,
        email: applicant.email,
        applications: applicant.applications.filter(application => 
          application.jobId.toString() === jobId
        ),
      })).filter(applicant => applicant.applications.length > 0); // Only include applicants with matching applications
  
      return {
        response: {
          shortListedApplicants: shortListedApplicants,
          jobTitle: jobData.jobTitle,
        },
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },

  addApplicantToTestInvited : async (jobId, applicantId) => {
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
  
      if (!jobData) {
        return {
          error: "Job not found",
        };
      }
  
      // Map test invited applicants and filter their applications
      const testInvitedApplicants = jobData.testInvitedApplicants.map(applicant => ({
        _id: applicant._id,
        email: applicant.email,
        applications: applicant.applications.filter(application => 
          application.jobId.toString() === jobId
        ),
      })).filter(applicant => applicant.applications.length > 0); // Only include applicants with matching applications
  
      return {
        response: {
          testInvitedApplicants: testInvitedApplicants,
          jobTitle: jobData.jobTitle,
        },
      };
    } catch (error) {
      return {
        error: error.message,
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
};
