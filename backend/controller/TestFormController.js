const mongoose = require("mongoose");
const Submission = require("../models/definations/submisionSchema");
const Applicants = require("../models/definations/applicantsSchema");
const Form = require("../models/definations/TestFormSchema");
const Evaluation =require("../models/definations/evaluationSchema")
const { evaluateAnswersSequentially } = require("../helpers/evaluateAnswers");
const jobSchema = require("../models/definations/jobSchema"); 
const Job = mongoose.model("Job", jobSchema); 

const createTest = async (req, res) => {
  const { job_id, generatedQuestions_id } = req.params;  
  console.log('Request Parameters:', req.params);
  
  const { title, questions, duration } = req.body;

  // Validate request parameters and body
  if (!job_id || !generatedQuestions_id) {
      return res.status(400).json({ message: "Job ID and Generated Questions ID are required." });
  }

  if (!title || !Array.isArray(questions) || questions.length === 0 || typeof duration !== 'number') {
      return res.status(400).json({ message: "Title, questions (array), and duration (number) are required." });
  }

  try {
      // Create the new form
      const newForm = new Form({
          title,
          questions,
          duration,
          generatedQuestions_id,
          job_id,
      });

      // Save the new form
      await newForm.save();

      // Update the Job schema with the new form ID
      const updatedJob = await Job.findByIdAndUpdate(
          job_id,
          { $push: { testForms: newForm._id } }, // Add the form ID to the testForms array
          { new: true } // Return the updated document
      );

      if (!updatedJob) {
          // If the job was not found, return a 404 response
          return res.status(404).json({ message: "Job not found." });
      }

      res.status(201).json({
          message: "Form created successfully",
          form: newForm,
          updatedJob 
      });
  } catch (error) {
      console.error('Error creating form:', error); // Log the error to the console
      res.status(500).json({ message: error.message });
  }
};

const updateForm = async (req, res) => {
  const { title, questions, duration } = req.body;
  const formId = req.params.test_id;

  try {
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      { title, questions, duration },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res
      .status(200)
      .json({ message: "Form updated successfully", form: updatedForm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEvaluationEntry = async (applicantId, formId, submissionId, evaluations, questions) => {
  try {
      const evaluationEntry = new Evaluation({
          applicantId: applicantId,
          formId: formId,
          submissionId: submissionId, // Include submissionId
          answerEvaluations: Object.entries(evaluations).map(([questionKey, evaluation], index) => {
              const questionObj = questions[index]; // Get the corresponding question from the incoming data
              const userAnswer = questionObj.answer; // Directly use the answer from the question object

              return {
                  questionId: questionObj.id, // Extract question ID
                  givenAnswer: userAnswer,      // Use the answer provided by the user
                  correctnessPercentage: evaluation.correctnessPercentage,
                  remarks: evaluation.remark,
              };
          }),
      });

      await evaluationEntry.save();
  } catch (error) {
      console.error("Error creating evaluation entry:", error.message);
      throw new Error("Failed to create evaluation entry.");
  }
};
const submitForm = async (req, res) => {
  const { name, email, questions } = req.body;
  const formId = req.params.formId;

  console.log("Incoming Form Data:", req.body);


  if (!name || !email || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Missing required fields." });
  }

  try {
      let applicant = await Applicants.findOne({ email });
      if (!applicant) {
          return res.status(404).json({ message: "Applicant not found" });
      }

      const form = await Form.findById(formId);
      if (!form) {
          return res.status(404).json({ message: "Form not found" });
      }

      // Create answers array based on submitted questions
      const answers = questions.map((question) => ({
          questionId: question.id,
          answer: question.answer,
      }));

      const submission = new Submission({
          applicantId: applicant._id,
          formId: formId,
          answers: answers,
      });

      await submission.save();

      if (!form.applicants.includes(applicant._id)) {
          form.applicants.push(applicant._id);
          await form.save();
      }

      // Create evaluations based on answers
      const evaluations = await evaluateAnswersSequentially(questions, answers);
      
      // Pass submission._id to createEvaluationEntry
      await createEvaluationEntry(applicant._id, formId, submission._id, evaluations, questions);

      return res.status(200).json({ message: "Submission successful", submission });
  } catch (error) {
      console.error("Error during form submission:", error.message);
      return res.status(500).json({ message: "Internal server error" });
  }
};

const getEvaluationBySubmissionId = async (req, res) => {
  const { submissionId, applicantId } = req.params; 
  console.log('Received request for:', req.params);
  
  try {
      // Fetch evaluation based on submissionId and applicantId
      const evaluation = await Evaluation.findOne({ applicantId, submissionId }).exec();
      
      if (!evaluation) {
          return res.status(404).json({ message: "Evaluation not found." });
      }

      // Fetch applicant information
      const applicant = await Applicants.findById(applicantId).exec();
      if (!applicant) {
          return res.status(404).json({ message: "Applicant not found." });
      }

      // Fetch the form associated with the evaluation
      const form = await Form.findById(evaluation.formId).exec();
      if (!form) {
          return res.status(404).json({ message: "Form not found." });
      }

      const result = evaluation.answerEvaluations.map(evaluation => {
          const question = form.questions.find(q => q._id.toString() === evaluation.questionId.toString());
          return {
              questionId: evaluation.questionId,
              questionText: question ? question.question : "Question not found", // Safely access the question text
              options: question ? question.options : [], // Include the options
              givenAnswer: evaluation.givenAnswer,
              correctnessPercentage: evaluation.correctnessPercentage,
              remarks: evaluation.remarks,
              correctAnswer: question ? question.correctAnswer : null // Safely access the correct answer
          };
      });

      return res.status(200).json({
          applicant: {
              id: applicant._id,
              name: applicant.name,
              email: applicant.email,
          },
          evaluations: result
      });
  } catch (error) {
      console.error("Error retrieving evaluation:", error.message);
      return res.status(500).json({ message: "Failed to retrieve evaluation." });
  }
};


const getFormById = async (req, res) => {
  const { test_form_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(test_form_id)) {
    return res.status(400).json({ message: "Invalid form ID format" });
  }

  try {
    const form = await Form.findById(test_form_id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find();

    if (!forms.length) {
      return res.status(404).json({ message: "No forms found" });
    }

    const response = forms.map((form) => ({
      id: form._id, // Include the form ID
      title: form.title,
      applicants: form.applicants ? form.applicants.length : 0, // Safe access
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getApplicantsByFormId = async (req, res) => {
  const { formId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Fetch the form title using formId
    const form = await Form.findById(formId).select("title"); // Adjust according to your Form schema

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Fetch submissions for the specific form
    const submissions = await Submission.find({ formId }) // Use formId directly
      .populate({
        path: "applicantId", // Populate the applicantId field
        select: "name email", // Select only the fields you need
      })
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
      .exec();

    // If no submissions found
    if (!submissions.length) {
      return res
        .status(404)
        .json({ message: "No submissions found for this form" });
    }

    // Construct response data
    const response = submissions.map((submission) => ({
      submissionId: submission._id, // Include submission ID
      applicant: submission.applicantId, // Applicant details
      submittedAt: submission.createdAt, // Use createdAt for submission date
    }));

    return res.status(200).json({
      total: submissions.length, // Total number of submissions returned
      submissions: response, // Include the array of submissions
      formId: formId, // Include the form ID in the response if needed
      title: form.title, // Include the form title in the response
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



const sendTestInviteToApplicant = async (req, res) => {
  const { jobId, applicantId } = req.body;

  // Fetch the job to get the associated testForm
  const job = await Job.findById(jobId).populate('testForms');
  if (!job) {
      return res.status(404).json({ message: "Job not found." });
  }

  // Since there is only one test for each job, we can access the first element
  const test = job.testForms[0];
  if (!test) {
      return res.status(404).json({ message: "No test associated with this job." });
  }

  const applicant = await Applicants.findById(applicantId);
  if (!applicant) {
      return res.status(404).json({ message: "Applicant not found." });
  }

  const token = generateToken();
  const testLink = new TestLink({
      token,
      testId: test._id,
      userEmail: applicant.email,
      createdAt: Date.now(),
      used: false
  });

  await testLink.save();
  const link = `https://yourdomain.com/test/${token}`;

  await sendTestInviteEmail(applicant.email, test.title, link);

  res.status(200).json({ message: "Test invite sent successfully", inviteLink: link });
};

const sendTestInvitesToAll = async (req, res) => {
  const { jobId, applicantIds } = req.body;

  // Fetch the job to get the associated testForm
  const job = await Job.findById(jobId).populate('testForms');
  if (!job) {
      return res.status(404).json({ message: "Job not found." });
  }

  // Since there is only one test for each job, we can access the first element
  const test = job.testForms[0];
  if (!test) {
      return res.status(404).json({ message: "No test associated with this job." });
  }

  const testInvites = [];

  for (const applicantId of applicantIds) {
      const applicant = await Applicants.findById(applicantId);
      if (!applicant) {
          continue; // Skip if applicant not found
      }

      const token = generateToken();
      const testLink = new TestLink({
          token,
          testId: test._id,
          userEmail: applicant.email,
          createdAt: Date.now(),
          used: false
      });

      await testLink.save();
      const link = `https://yourdomain.com/test/${token}`; // Construct the test link

      // Send the test invite email
      await sendTestInviteEmail(applicant.email, test.title, link);

      testInvites.push(link); // Collecting invites for logging or response
  }

  res.status(200).json({ message: "Test invites sent successfully", invites: testInvites });
};



// Implement the email sending function
const sendTestInviteEmail = async (email, testTitle, link) => {
  // Your email sending logic (e.g., using nodemailer)
  console.log(`Sending email to: ${email}`);
  console.log(`Test Title: ${testTitle}`);
  console.log(`Test Link: ${link}`);
 
};



module.exports = {
  createTest,
  sendTestInviteToApplicant,
  sendTestInvitesToAll,
  getFormById,
  updateForm,
  getApplicantsByFormId,
  getAllForms,
  submitForm,
  getEvaluationBySubmissionId
};
