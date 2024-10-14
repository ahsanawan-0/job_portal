const User = require('../models/definations/userSchema');
const sendEmail = require('../helpers/sendEmail'); // Import sendEmail function

// Create a new user and store resume and cover letter

const createUser = async (req, res) => {
  try {
    const { name, email, experience, coverLetter } = req.body;
    
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

    // Prepare job application details
    const job = {
      title: "Job Title Here", // Replace with the actual job title if available
      company: "Company Name Here", // Replace with the actual company name if available
      location: "Job Location Here", // Replace with the actual job location if available
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
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error); // Log the error for debugging
    res.status(500).json({ error: 'Error creating user' });
  }
};


module.exports = {
  createUser,
};
