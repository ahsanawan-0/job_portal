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
  getHiredCandidates,
  getAllActiveJobs,
} = require("../controller/jobController");
const verifyToken = require("../middleweres/verifyToken");

router.post("/create-job", createJobPost);

router.get("/jobs/alljobs", getJobsforPagination);

router.get("/jobs/recentJobs", getRecentJobPosts);

router.get("/jobs/alljobsforcount", getAllJobsForCount);

router.put("/jobs/:id/status", updateJobStatus);

router.get("/getSignleJob/:id", getJobPostById);


router.delete("/jobs/:id/delete", deleteJobPost);

router.get("/jobs/search", searchJobPosts); 

router.get("/jobs/hired-candidates", getHiredCandidates);
// Route to get all active jobs
router.get('/jobs/active', getAllActiveJobs);


module.exports = router;
