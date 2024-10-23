const express = require('express');
const router = express.Router();
const applicantsController = require('../controller/applicantsController');
const upload = require('../helpers/fileHelper');

// POST route to create a user with resume upload
router.post('/submit-application/:jobId', upload.single('resume'), applicantsController.ApplicantsApplyForJob);

module.exports = router;