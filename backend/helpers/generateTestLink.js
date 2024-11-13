const TestLink = require('../models/TestLink');
const TestSubmission = require('../models/TestSubmission');
const { generateToken } = require('../helpers/tokenHelper');

// Generate unique test link
const sendTestInvites = async (req, res) => {
    const { jobId, applicantIds } = req.body;

    const test = await Form.findOne({ job_id: jobId }); // Fetch the created test
    if (!test) {
        return res.status(404).json({ message: "Test not found." });
    }

    const testInvites = [];

    for (const applicantId of applicantIds) {
        const applicant = await Applicant.findById(applicantId);
        if (!applicant) {
            continue; // Skip if applicant not found
        }

        const token = generateToken(); // Function from the helpers
        const testLink = new TestLink({
            token,
            testId: test._id,
            userEmail: applicant.email,
            createdAt: Date.now(),
            used: false
        });

        await testLink.save();
        const link = `https://yourdomain.com/test/${token}`; // Construct the link

        // Send email logic here (use your email sending function)
        await sendTestInviteEmail(applicant, test.title, link);

        testInvites.push(link); // Collecting invites for logging or response
    }

    res.status(200).json({ message: "Test invites sent successfully", invites: testInvites });
};

// Accessing the test
const accessTest = async (req, res) => {
    const { token } = req.params;

    const testLink = await TestLink.findOne({ token, used: false });

    if (!testLink) {
        return res.status(404).json({ message: 'Invalid or expired link.' });
    }

    // Optionally mark the link as used for one-time access
    // testLink.used = true; // Uncomment if you want one-time use
    await testLink.save();

    // Fetch the test data
    const testData = await getTestById(testLink.testId); // Implement this function according to your needs
    res.json(testData);
};

// Submitting test answers
const submitTest = async (req, res) => {
    const { token, answers } = req.body;

    const testLink = await TestLink.findOne({ token, used: true });

    if (!testLink) {
        return res.status(403).json({ message: 'Invalid submission attempt.' });
    }

    const submission = new TestSubmission({
        testId: testLink.testId,
        userEmail: testLink.userEmail,
        answers,
        submittedAt: Date.now()
    });

    await submission.save();
    res.json({ message: 'Submission successful!' });
};

module.exports = {
    generateTestLink,
    accessTest,
    submitTest
};