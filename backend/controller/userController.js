const User = require('../models/definations/userSchema');
const jobModel = require('../models/jobModel'); // Import job model
const sendEmail = require('../helpers/sendEmail'); // Import sendEmail function

// Create a new user and store resume and cover letter
const UserApplyForJob = async (req, res) => {
  try {
    const { name, email, experience, coverLetter, jobId } = req.body; // Add jobId to request body
    
    // Check if a file was uploaded
    if (!req.file) {
      console.log("No resume file uploaded.");
      return res.status(400).json({ error: 'Resume file is required' });
    }

    const resumePath = req.file.path;

    // Check for existing user with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User with email ${email} already exists.`);
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = new User({
      name,
      email,
      experience,
      coverLetter,
      resume: resumePath,
    });

    await newUser.save();
    console.log(`User ${name} with email ${email} created successfully.`);

    // Apply for the job and update the applicants list
    const updatedJob = await jobModel.applyForJob(jobId, newUser._id);
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Prepare job application details
    const job = {
      title: updatedJob.title, // Use the actual job title
      company: updatedJob.company, // Use the actual company name
      location: updatedJob.location, // Use the actual job location
      experienceRequired: experience,
    };

    // Send application email
    try {
      console.log("Calling sendEmail function.");
      await sendEmail(newUser, job);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({ error: 'User created, but email sending failed' });
    }

    res.status(201).json({
      message: 'User created and applied for the job successfully',
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error); // Log the error for debugging
    res.status(500).json({ error: 'Error creating user' });
  }
};

module.exports = {
  UserApplyForJob,
};
