const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOnsiteEmail = async (applicant, job, interviewDetails) => {
  const { date, time } = interviewDetails;
  console.log("in send onsite file", applicant.email);
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: applicant.email,
    subject: `Interview Invitation: ${job.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; margin: 20px;">
        <h2 style="color: #333;">You have been Invited for OnSite Interview!</h2>
        <p style="font-size: 16px; color: #555;">Dear ${applicant.name},</p>
        <p style="font-size: 16px; color: #555;"> Congratulations! We are excited to invite you for an onsite interview for the position of <strong>${job.title}</strong> at <strong>SDSol Technologies</strong> .</p>
        
        <h3 style="color: #007BFF;">Interview Details</h3>
        <ul style="font-size: 16px; color: #555;">
          <li><strong>Date: </strong>${date}</li>
          <li><strong>Time: </strong>${time}</li>
          <li><strong>Location: </strong> Shaheen Complex، Office # 08, 08th Floor, Egerton Rd, Garhi Shahu, Lahore, Punjab 54000</li>
          <li><strong>Contact: </strong>(042) 36376227</li>
        </ul>

        <p style="font-size: 16px; color: #555;"> Please bring a copy of your resume, and a valid ID for verification. 
        </p>
        
        <p style="font-size: 16px; color: #555;">If you have any questions, feel free to contact us at <a href="mailto:${process.env.EMAIL_USERNAME}">${process.env.EMAIL_USERNAME}</a>.</p>

        <hr style="margin: 20px 0; border: 1px solid #e0e0e0;">
        <p style="font-size: 14px; color: #888;">Best Regards,<br>SDSol Technologies Recruitment Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Email sending failed: " + error.message);
  }
};

module.exports = sendOnsiteEmail;
