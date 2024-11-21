 const Job = require("./definations/jobSchema"); // Correct path and filename
const Applicant = require("./definations/applicantsSchema");


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

const updateJobStatus = async (jobId) => {
  try {
    const job = await Job.findById(jobId);
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { status: "Expired" },
      { new: true } // Ensure it returns the updated document
    );

    return updatedJob;
  } catch (error) {
    console.error(`Error fetching recent jobs: ${error.message}`);
    throw error;
  }
};

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
    const job = await Job.findById(jobId).populate("applicants");

    if (!job) {
      throw new Error("Job not found");
    }

    if (job.applicants.length > 0) {
      await Applicant.deleteMany({ _id: { $in: job.applicants } });
    }

    await Job.findByIdAndDelete(jobId);

    return { message: "Job and associated applicants deleted successfully." };
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
      throw new Error("The job application period has expired.");
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
      throw new Error("The job application period has expired.");
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
    const job = await Job.findById(jobId).select("jobTitle");
    if (!job) {
      throw new Error("Job not found");
    }
    // Return the job title
    return job.jobTitle;
  } catch (error) {
    console.error(`Error fetching job title: ${error.message}`);
    throw error;
  }
};

const getHiredCandidates = async () => {
  try {
    const jobs = await Job.find().populate("hiredApplicants");

    const hiredCandidates = jobs
      .flatMap((job) => (job.hiredApplicants ? job.hiredApplicants : []))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return hiredCandidates;
  } catch (error) {
    console.error(`Error fetching hired candidates: ${error.message}`);
    throw error;
  }
};
// Get all active jobs
const getAllActiveJobs = async () => {
  try {
    return await Job.find({ status: "Active" }).select("_id jobTitle experience");
  } catch (error) {
    console.error(`Error fetching all active jobs: ${error.message}`);
    throw error;
  }
};
// const updateJob = async (jobId, jobData) => {
//   try {
//     const updatedJob = await Job.findByIdAndUpdate(jobId, jobData, {
//       new: true, // Return the updated document
//       runValidators: true, // Ensure that validation rules are applied
//     });

//     return updatedJob; // Return the updated job document
//   } catch (error) {
//     console.error("Error updating job:", error);
//     throw new Error('Could not update job'); // Handle error appropriately
//   }
// };


module.exports = {
  createJob,
  getAllActiveJobs,
  getAllJobs,
  updateJob,
  getJobById,
  deleteJob,
  getJobTitleById,
  searchJobPosts,
  getRecentJobs,
  getJobsForPagination,
  checkExpiration,
  getAllJobsForCount,
  applyForJob,
  updateJobStatus,
  getHiredCandidates,
};
