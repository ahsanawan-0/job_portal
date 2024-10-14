const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const upload = require('../helpers/fileHelper');

// POST route to create a user with resume upload
router.post('/submit-application', upload.single('resume'), userController.createUser);

module.exports = router;
