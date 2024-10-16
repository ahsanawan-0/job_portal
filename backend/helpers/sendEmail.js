const nodemailer = require("nodemailer");

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send a job application confirmation email
const sendEmail = async (applicant, job) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: applicant.email,
    subject: `Job Application: ${job.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; margin: 20px;">
        <h2 style="color: #333;">Thank you for applying!</h2>
        <p style="font-size: 16px; color: #555;">Dear ${applicant.name},</p>
        <p style="font-size: 16px; color: #555;">We have received your application for the position of <strong>${job.title}</strong>.</p>
        
        <h3 style="color: #007BFF;">Job Details</h3>
        <ul style="font-size: 16px; color: #555;">
          <li><strong>Position:</strong> ${job.title}</li>
          <li><strong>Company:</strong> ${job.company}</li>
          <li><strong>Location:</strong> ${job.location}</li>
          <li><strong>Experience Required:</strong> ${job.experienceRequired}</li>
        </ul>

        <p style="font-size: 16px; color: #555;">We will review your resume and cover letter and get back to you soon.</p>
        
        <p style="font-size: 16px; color: #555;">If you have any questions, feel free to contact us at <a href="mailto:${process.env.EMAIL_USERNAME}">${process.env.EMAIL_USERNAME}</a>.</p>

        <hr style="margin: 20px 0; border: 1px solid #e0e0e0;">
        <p style="font-size: 14px; color: #888;">Best Regards,<br>${job.company}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Email sending failed: " + error.message);
  }
};

module.exports = sendEmail;
