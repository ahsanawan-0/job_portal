const mongoose = require("mongoose");
const Applicant = require("../models/definations/applicantsSchema");
const Job = require("../models/definations/jobSchema");
// const Job = mongoose.model("Job", jobSchema);
module.exports = {
  getAllApplications: async () => {
    try {
      const applicants = await Applicant.find({});
   
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
// getApplicantsForJob: async (jobId) => {
//   try {
//     const jobData = await Job.findById(jobId)
//       .populate({
//         path: "applicants",
//         options: { sort: { createdAt: -1 } },
//       })
//       .exec();

//     if (!jobData) {
//       return {
//         error: "Job not found",
//       };
//     }

//     // Map applicants and filter their applications
//     const applicants = jobData.applicants.map(applicant => ({
//       _id: applicant._id,
//       email: applicant.email,
//       applications: applicant.applications.filter(application => 
//         application.jobId.toString() === jobId
//       ),
//     })).filter(applicant => applicant.applications.length > 0); // Only include applicants with matching applications

//     return {
//       response: {
//         applicants: applicants,
//         jobTitle: jobData.jobTitle,
//         expirationDate: jobData.expirationDate,
//         status: jobData.status,
//       },
//     };
//   } catch (error) {
//     return {
//       error: error.message,
//     };
//   }
// },

// const getApplicantsForJob = async (req, res) => {
//   try {
//     const jobId = req.params.jobId;
//     if (!jobId) {
//       return res.status(400).send({
//         message: "Job ID is required",
//       });
//     }

//     const applicantsData = await applicantModel.getApplicantsForJob(jobId);

//     if (applicantsData.error) {
//       return res.status(500).send({
//         error: applicantsData.error,
//       });
//     }

//     const totalApplicants = applicantsData.response.applicants.length;

//     return res.status(200).send({
//       message: "All Applicants for the Job",
//       response: applicantsData.response,
//       totalApplicants: totalApplicants,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       error: error.message,
//     });
//   }
// };


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
    const applicants = await Promise.all(
      jobData.applicants.map(async (applicant) => {
        // Separate applications into the current job and duplicates
        const jobApplications = applicant.applications.filter(application => 
          application.jobId.toString() === jobId
        );

        const duplicates = applicant.applications.filter(application => 
          application.jobId.toString() !== jobId
        );

        // Format duplicates to include jobId and jobTitle
        const formattedDuplicates = await Promise.all(
          duplicates.map(async (dupApp) => {
            const job = await Job.findById(dupApp.jobId).select('jobTitle');
            return {
              jobId: dupApp.jobId,
              jobTitle: job ? job.jobTitle : 'Unknown Job'
            };
          })
        );

        return {
          _id: applicant._id,
          email: applicant.email,
          applications: jobApplications, // This will have the application for the specific job
          duplicates: formattedDuplicates, // Include formatted duplicates
        };
      })
    );

    // Filter out applicants without matching applications
    const filteredApplicants = applicants.filter(applicant => applicant.applications.length > 0);

    return {
      response: {
        applicants: filteredApplicants,
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


// Helper function to get job title by jobId

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
      const shortListedApplicants = jobData.shortListedApplicants
        .map((applicant) => ({
          _id: applicant._id,
          email: applicant.email,
          applications: applicant.applications.filter(
            (application) => application.jobId.toString() === jobId
          ),
        }))
        .filter((applicant) => applicant.applications.length > 0); // Only include applicants with matching applications

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
  
    
      const applicantData = await Applicant.findById(applicantId); 
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
  
      
      const testInvitedApplicants = jobData.testInvitedApplicants.map(applicant => ({
        _id: applicant._id,
        email: applicant.email,
        applications: applicant.applications.filter(application => 
          application.jobId.toString() === jobId
        ),
      })).filter(applicant => applicant.applications.length > 0); 
  
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

      const invitedApplicants = jobData.onSiteInvite
        .map((applicant) => ({
          _id: applicant._id,
          email: applicant.email,
          applications: applicant.applications.filter(
            (application) => application.jobId.toString() === jobId
          ),
        }))
        .filter((applicant) => applicant.applications.length > 0);

      return {
        response: {
          invitedApplicants: invitedApplicants,
          jobTitle: jobData.jobTitle,
        },
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },

  createOnSiteReInviteApplicants: async (jobId, applicantId) => {
    try {
      const jobData = await Job.findByIdAndUpdate(
        jobId,
        {
          $addToSet: { onSiteReInvite: applicantId },
        },
        { new: true }
      ).populate("onSiteReInvite");

      if (!jobData) {
        return {
          error: new Error(
            "Job not found or failed to update onsite invite list"
          ),
        };
      }

      const invitedApplicant = jobData.onSiteReInvite.find(
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

  getAllOnSiteReInviteApplicants: async (jobId) => {
    try {
      const jobData = await Job.findById(jobId)
        .populate({
          path: "onSiteReInvite",
          options: { sort: { createdAt: -1 } },
        })
        .exec();

      if (!jobData) {
        return {
          error: new Error("Job not found or failed to fetch data"),
        };
      }

      const invitedApplicants = jobData.onSiteReInvite
        .map((applicant) => ({
          _id: applicant._id,
          email: applicant.email,
          applications: applicant.applications.filter(
            (application) => application.jobId.toString() === jobId
          ),
        }))
        .filter((applicant) => applicant.applications.length > 0);

      return {
        response: {
          invitedApplicants: invitedApplicants,
          jobTitle: jobData.jobTitle,
        },
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
};
