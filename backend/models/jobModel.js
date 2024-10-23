const mongoose = require("mongoose");
const jobSchema = require("./definations/jobSchema"); // Correct path and filename

const Job = mongoose.model("Job", jobSchema);

const createJob = async (jobData) => {
  const job = new Job(jobData);
  return await job.save();
};

const getAllJobs = async (limit, skip) => {
  const totalJobs = await Job.countDocuments();

  const jobs = await Job.find()
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  return { jobs, totalJobs };
};

const getRecentJobs = async () => {
  return await Job.find().sort({ createdAt: -1 }).limit(5);
};

const getAllJobsForCount = async () => {
  return await Job.find();
};

const getJobById = async (jobId) => {
  return await Job.findById(jobId);
};

const updateJob = async (jobId, updateData) => {
  return await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteJob = async (jobId) => {
  return await Job.findByIdAndDelete(jobId);
};

const searchJobPosts = async (keyword) => {
  const query = {
    $or: [
      { jobTitle: { $regex: keyword, $options: "i" } },
      { tags: { $regex: keyword, $options: "i" } },
    ],
  };

  return await Job.find(query).sort({ createdAt: -1 });
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobPosts,
  getRecentJobs,
  getAllJobsForCount,
};
