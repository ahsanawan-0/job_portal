const jobModel = require("../models/jobModel");
const crypto = require("crypto");
const TestLink = require("../models/definations/TestLinkSchema"); 
const sendEmail = require("../helpers/sendEmail");
const applicantModel = require("../models/applicantsModel");
const Applicants = require("../models/definations/applicantsSchema");
const { uploadFile } = require("../helpers/fileHelper");
const { sendTestInviteEmail } = require("../helpers/testInvite");

const ApplicantsApplyForJob = async (req, res) => {
  try {
    const { name, email, experience, coverLetter } = req.body;
    const jobId = req.params.jobId;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    const job = await jobModel.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const resumeId = await uploadFile(req.file.path, req.file.mimetype, folderId);

    // Check if applicant already exists
    let applicant = await Applicants.findOne({ email });

    const applicationData = {
      name, // Include name in application data
      experience,
      coverLetter,
      resume: resumeId,
      jobId,
    };

    // Check if applicant has already applied for this job
    if (applicant && applicant.applications.some(app => app.jobId.toString() === jobId)) {
      return res.status(400).json({ error: "You have already applied for this job" });
    }

    if (applicant) {
      // Update existing applicant's applications
      applicant.applications.push(applicationData);
      await applicant.save();
    } else {
      // Create a new applicant
      const newApplicant = new Applicants({
        email,
        applications: [applicationData],
      });
      await newApplicant.save();
      applicant = newApplicant; 
    }

    await jobModel.applyForJob(jobId, applicant._id);

    // Prepare job details for email
    const jobDetails = {
      title: job.jobTitle,
      company: "SDSOL TECHNOLOGIES",
      location: job.location,
      experienceRequired: experience,
    };

    try {
  
      await sendEmail({ name, email }, jobDetails);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({ error: "User applied, but email sending failed" });
    }

    res.status(201).json({
      message: "Application submitted successfully",
      data: applicant,
      jobDetails: jobDetails,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ error: "Error applying for job" });
  }
};





const getAllApplications = async (req, res) => {
  try {
    const applicants = await applicantModel.getAllApplications();
    const totalApplicants = applicants.response.length;
    if (applicants.error) {
      return res.send({
        error: applicants.error,
      });
    }
    return res.send({
      message: "All Applicants",
      response: applicants.response,
      totalApplicants: totalApplicants,
    });
  } catch (error) {
    return res.send({
      error: error,
    });
  }
};

const getApplicantsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.status(400).send({
        message: "Job ID is required",
      });
    }

    const applicantsData = await applicantModel.getApplicantsForJob(jobId);

    if (applicantsData.error) {
      return res.status(500).send({
        error: applicantsData.error,
      });
    }

    const totalApplicants = applicantsData.response.applicants.length;

    return res.status(200).send({
      message: "All Applicants for the Job",
      response: applicantsData.response,
      totalApplicants: totalApplicants,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
};





const createShortListedApplicantsForJob = async (req, res) => {
  try {
    const { applicantId } = req.body;
    // console.log("in controller applicantId", applicantId);
    const jobId = req.params.jobId;
    // console.log("in controller jobid", jobId);
    if (!jobId || !applicantId) {
      return res.send({
        message: "job id and applicant id is required",
      });
    }
    const result = await applicantModel.createShortListedApplicantsForJob(
      jobId,
      applicantId
    );
    if (result.error) {
      return res.send({
        message: result.error,
      });
    }
    return res.send({
      message: "Short Listed Candidates",
      response: result.response.shortListedApplicants,
    });
  } catch (error) {
    return res.send({
      error: error,
    });
  }
};

const getAllShortListedApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.status(400).send({
        message: "Job ID is required",
      });
    }

    const shortListedData = await applicantModel.getAllShortListedApplicants(jobId);
    
    if (shortListedData.error) {
      return res.status(500).send({
        error: shortListedData.error,
      });
    }

    const totalShortListedApplicants = shortListedData.response.shortListedApplicants.length;

    return res.status(200).send({
      message: "All Short Listed Applicants for the Job",
      response: shortListedData.response,
      totalApplicants: totalShortListedApplicants,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
};

const createTestInvitedApplicantsForJob = async (req, res) => {
  try {
    const { applicantId, testId } = req.body;
    const jobId = req.params.jobId;

    if (!jobId || !applicantId || !testId) {
      return res.status(400).send({ message: "Job ID, Applicant ID, and Test ID are required." });
    }

    // Add applicant to the invited list
    const result = await applicantModel.addApplicantToTestInvited(jobId, applicantId);
    if (result.error) {
      return res.status(500).send({ message: result.error });
    }

    const { job, applicantData } = result;

    
    if (!applicantData || !applicantData.email) {
      return res.status(400).send({ message: "Applicant email not found." });
    }

    
    const applicantName = applicantData.applications.find(app => app.jobId.toString() === jobId)?.name;

    if (!applicantName) {
      return res.status(400).send({ message: "Applicant name not found." });
    }

    
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day expiration

    
    const testLink = new TestLink({
      applicantId,
      testId,
      token,
      used: false,
      expiresAt,
    });

    await testLink.save();

    
    const testLinkUrl = `${process.env.FRONTEND_URL}/test/user/${testId}?token=${token}&applicant=${applicantId}&jobId=${jobId}`;

    // Get job title
    const jobTitle = await jobModel.getJobTitleById(jobId);
    if (!jobTitle) {
      return res.status(404).send({ message: "Job not found." });
    }

    // Send the test invite email
    await sendTestInviteEmail({ name: applicantName, email: applicantData.email }, jobTitle, testLinkUrl);

    return res.send({
      message: "Test invitation sent successfully.",
      response: job, // Return the job object
    });
  } catch (error) {
    console.error("Error inviting applicant for test:", error);
    return res.status(500).send({ error: error.message });
  }
};

const getAllTestInvitedApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.status(400).send({
        message: "Job ID is required",
      });
    }

    const testInvitedData = await applicantModel.getAllTestInvitedApplicants(jobId);
    
    if (testInvitedData.error) {
      return res.status(500).send({
        error: testInvitedData.error,
      });
    }

    const totalTestInvitedApplicants = testInvitedData.response.testInvitedApplicants.length;

    return res.status(200).send({
      message: "All Test Invited Applicants for the Job",
      response: testInvitedData.response,
      totalApplicants: totalTestInvitedApplicants,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
};

const createHiredApplicantsForJob = async (req, res) => {
  try {
    const { applicantId } = req.body;
    console.log("in controller applicantId", applicantId);
    const jobId = req.params.jobId;
    console.log("in controller jobid", jobId);
    if (!jobId || !applicantId) {
      return res.send({
        message: "job id and applicant id is required",
      });
    }
    const result = await applicantModel.createHiredApplicantsForJob(
      jobId,
      applicantId
    );
    if (result.error) {
      return res.send({
        message: result.error,
      });
    }
    return res.send({
      message: "Hired Candidate",
      response: result.response.addToHired,
    });
  } catch (error) {
    return res.send({
      error: error,
    });
  }
};

const getAllHiredApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.send({
        message: "Job Id is required",
      });
    }
    const HiredData = await applicantModel.getAllHiredApplicants(jobId);

    const totalHiredApplicants = HiredData.response.hiredApplicants.length;
    if (HiredData.error) {
      return res.send({
        error: HiredData.error,
      });
    }
    return res.send({
      message: "All Hired Applicants for the Job",
      response: HiredData.response,
      totalApplicants: totalHiredApplicants,
    });
  } catch (error) {
    return res.send({
      error: error,
    });
  }
};



const getApplicantById = async (req, res) => {
  try {
    const { jobId } = req.query;
    const { applicantId } = req.query;

    if (!applicantId || !jobId) {
      return res.status(400).json({ error: "Applicant ID and Job ID are required." });
    }

    const applicantData = await Applicants.findById(applicantId).select("email applications.jobId applications.name");

    if (!applicantData) {
      return res.status(404).json({ error: "Applicant not found." });
    }

    const application = applicantData.applications.find(app => app.jobId.toString() === jobId);

    if (!application) {
      return res.status(404).json({ error: "No application found for the specified job." });
    }

    res.status(200).json({
      message: "Applicant name retrieved successfully.",
      data: {
        name: application.name,
        email: applicantData.email,

      },
    });
  } catch (error) {
    console.error("Error fetching applicant data:", error);
    res.status(500).json({ error: "An error occurred while fetching applicant data." });
  }
};


const createOnSiteInviteApplicants = async (req, res) => {
  try {
    const { applicantId } = req.body;
    const jobId = req.params.jobId;

    if (!jobId || !applicantId) {
      return res.status(400).send({
        message: "Job ID and Applicant ID are required",
      });
    }
    const result = await applicantModel.createOnSiteInviteApplicants(
      jobId,
      applicantId
    );

    if (result.error) {
      return res.status(500).send({
        message: result.error.message || "Failed to create onsite invite",
      });
    }

    const invitedApplicant = result.response.invitedApplicant;
    console.log("onsite in controller: ", invitedApplicant);

    const job = {
      title: result.response.jobTitle,
      company: result.response.jobCompany,
    };

    try {
      await sendOnsiteEmail(invitedApplicant, job);
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      return res.status(500).send({
        message: "Onsite invite created, but email sending failed.",
      });
    }

    return res.send({
      message: "Onsite invite created and email sent successfully.",
      response: result.response,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message || "An error occurred",
    });
  }
};


const getAllOnSiteInviteApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    if (!jobId) {
      return res.status(400).send({
        message: "Job ID is required",
      });
    }

    const invitedData = await applicantModel.getAllOnSiteInviteApplicants(
      jobId
    );

    if (invitedData.error) {
      return res.status(500).send({
        error:
          invitedData.error.message || "Failed to fetch onsite invite data",
      });
    }

    const totalInvitedApplicants =
      invitedData.response.invitedApplicants.length;

    return res.send({
      message: "All Onsite Invited Applicants for the Job",
      response: invitedData.response,
      totalApplicants: totalInvitedApplicants,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message || "An error occurred",
    });
  }
};

module.exports = {
  ApplicantsApplyForJob,
  getAllApplications,
  getApplicantsForJob,
  createShortListedApplicantsForJob,
  getAllShortListedApplicants,
  createTestInvitedApplicantsForJob,
  getAllTestInvitedApplicants,
  createHiredApplicantsForJob,
  getAllHiredApplicants,
  getApplicantById,
  createOnSiteInviteApplicants,
  getAllOnSiteInviteApplicants,
};
