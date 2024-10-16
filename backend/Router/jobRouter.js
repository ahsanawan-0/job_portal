const router = require("express").Router();
const {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
} = require("../controller/jobController");


// routes/jobRoutes.js
router.post("/create-job", createJobPost);

// Get all job posts
router.get("/getalljobs", getAllJobPosts);

// Get a single job post by ID
router.get("/jobs/:id", getJobPostById);

// Update a job post by ID
router.put("/:id", updateJobPost);

// Delete a job post by ID
router.delete("/:id", deleteJobPost);

module.exports = router;
