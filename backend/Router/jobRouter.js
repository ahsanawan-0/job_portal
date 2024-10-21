const router = require("express").Router();
const {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
  searchJobPosts,
} = require("../controller/jobController");


// routes/jobRoutes.js
router.post("/create-job", createJobPost);

// Get all job posts
router.get("/jobs/alljobs",getAllJobPosts);

// Get a single job post by ID
router.get("/getSignleJob/:id", getJobPostById);

// Update a job post by ID
// router.put("/:id", updateJobPost);?

// Delete a job post by ID
// router.delete("/:id", deleteJobPost);

router.get("/jobs/search", searchJobPosts); // Add the search route for admins

module.exports = router;
