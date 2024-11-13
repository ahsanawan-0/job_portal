const nodemailer = require("nodemailer");

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.email_username,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendTestInviteEmail = async (applicant, jobTitle, testLink) => {
    const mailOptions = {
      from: process.env.email_username,
      to: applicant.email,
      subject: `Test Invitation for Job Application: ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; margin: 20px;">
          <h2 style="color: #333;">You've Been Invited to Take a Test!</h2>
          <p style="font-size: 16px; color: #555;">Dear ${applicant.name},</p>
          <p style="font-size: 16px; color: #555;">We are pleased to invite you to take a test for the position of <strong>${jobTitle}</strong>.</p>
          
          <h3 style="color: #007BFF;">Test Details</h3>
          <p style="font-size: 16px; color: #555;">
            Please click the link below to access your test:
          </p>
          <p>
            <a href="${testLink}" style="color: #007BFF; text-decoration: underline;">Take the Test</a>
          </p>
  
          <p style="font-size: 16px; color: #555;">If you have any questions, feel free to contact us at <a href="mailto:${process.env.email_username}">${process.env.email_username}</a>.</p>
  
          <hr style="margin: 20px 0; border: 1px solid #e0e0e0;">
          <p style="font-size: 14px; color: #888;">Best Regards,<br>${process.env.company_name || 'Your Company Name'}</p>
        </div>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error("Email sending failed: " + error.message);
    }
  };

module.exports = {
  sendTestInviteEmail // New function for test invitations
};