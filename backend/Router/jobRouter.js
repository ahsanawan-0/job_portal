const router = require("express").Router();
const {
  createJobPost,
  getJobsforPagination,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
  searchJobPosts,
  getRecentJobPosts,
  getAllJobsForCount,
  updateJobStatus,
} = require("../controller/jobController");
const verifyToken = require("../middleweres/verifyToken");

// routes/jobRoutes.js
router.post("/create-job", createJobPost);

// Get all job posts
router.get("/jobs/alljobs", getJobsforPagination);

router.get("/jobs/recentJobs", getRecentJobPosts);

router.get("/jobs/alljobsforcount", getAllJobsForCount);

router.put("/jobs/:id/status", updateJobStatus);

// Get a single job post by ID
router.get("/getSignleJob/:id", getJobPostById);

// Update a job post by ID
// router.put("/:id", updateJobPost);?

// Delete a job post by ID
router.delete("/jobs/:id/delete", deleteJobPost);

router.get("/jobs/search", searchJobPosts); // Add the search route for admins

module.exports = router;
