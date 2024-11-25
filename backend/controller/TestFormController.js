const mongoose = require("mongoose");
const Submission = require("../models/definations/submisionSchema");
const Applicants = require("../models/definations/applicantsSchema");
const Form = require("../models/definations/TestFormSchema");
const Evaluation = require("../models/definations/evaluationSchema");
const { evaluateAnswersSequentially } = require("../helpers/evaluateAnswers");
const Job = require("../models/definations/jobSchema");

const createTest = async (req, res) => {
  const { job_id, generatedQuestions_id } = req.params;
  console.log("Request Parameters:", req.params);

  const { title, questions, duration } = req.body;

  if (!job_id || !generatedQuestions_id) {
    return res
      .status(400)
      .json({ message: "Job ID and Generated Questions ID are required." });
  }

  if (
    !title ||
    !Array.isArray(questions) ||
    questions.length === 0 ||
    typeof duration !== "number"
  ) {
    return res.status(400).json({
      message: "Title, questions (array), and duration (number) are required.",
    });
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

    await newForm.save();

    const updatedJob = await Job.findByIdAndUpdate(
      job_id,
      { $push: { testForms: newForm._id } },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found." });
    }

    res.status(201).json({
      message: "Form created successfully",
      form: newForm,
      updatedJob,
    });
  } catch (error) {
    console.error("Error creating form:", error); // Log the error to the console
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

const createEvaluationEntry = async (
  applicantId,
  formId,
  submissionId,
  evaluations,
  questions
) => {
  try {
    const evaluationEntry = new Evaluation({
      applicantId: applicantId,
      formId: formId,
      submissionId: submissionId,
      answerEvaluations: Object.entries(evaluations).map(
        ([questionKey, evaluation], index) => {
          const questionObj = questions[index];
          const userAnswer = questionObj.answer;

          return {
            questionId: questionObj.id,
            givenAnswer: userAnswer,
            correctnessPercentage: evaluation.correctnessPercentage,
            remarks: evaluation.remark,
          };
        }
      ),
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

    const existingSubmission = await Submission.findOne({
      applicantId: applicant._id,
      formId: formId,
    });

    if (existingSubmission) {
      return res
        .status(400)
        .json({ message: "You have already submitted this test." });
    }

    // Create answers array based on submitted questions
    const answers = questions.map((question) => ({
      questionId: question.id,
      answer: question.answer || null, // Allow null for unattempted questions
    }));

    // Check if all answers are null
    const allUnattempted = answers.every((answer) => answer.answer === null);

    // Create submission object
    const submission = new Submission({
      applicantId: applicant._id,
      formId: formId,
      answers: answers,
    });

    // Save submission
    await submission.save();

    // Update form applicants list
    if (!form.applicants.includes(applicant._id)) {
      form.applicants.push(applicant._id);
      await form.save();
    }

    // Create evaluations based on answers
    const evaluations = await evaluateAnswersSequentially(questions, answers);

    // Pass submission._id to createEvaluationEntry
    await createEvaluationEntry(
      applicant._id,
      formId,
      submission._id,
      evaluations,
      questions
    );

    // Provide feedback based on whether questions were attempted
    if (allUnattempted) {
      return res.status(200).json({
        message: "Submission successful, but no questions were attempted.",
        submission,
      });
    }

    return res
      .status(200)
      .json({ message: "Submission successful", submission });
  } catch (error) {
    console.error("Error during form submission:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getEvaluationBySubmissionId = async (req, res) => {
  const { submissionId, applicantId } = req.params;
  console.log("Received request for:", req.params);

  try {
    // Fetch evaluation based on submissionId and applicantId
    const evaluation = await Evaluation.findOne({
      applicantId,
      submissionId,
    }).exec();

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

    const result = evaluation.answerEvaluations.map((evaluation) => {
      const question = form.questions.find(
        (q) => q._id.toString() === evaluation.questionId.toString()
      );
      return {
        questionId: evaluation.questionId,
        questionText: question ? question.question : "Question not found", // Safely access the question text
        options: question ? question.options : [], // Include the options
        givenAnswer: evaluation.givenAnswer,
        correctnessPercentage: evaluation.correctnessPercentage,
        remarks: evaluation.remarks,
        correctAnswer: question ? question.correctAnswer : null, // Safely access the correct answer
      };
    });

    return res.status(200).json({
      applicant: {
        id: applicant._id,
        name: applicant.name,
        email: applicant.email,
      },
      formId: evaluation.formId,
      evaluations: result,
    });
  } catch (error) {
    console.error("Error retrieving evaluation:", error.message);
    return res.status(500).json({ message: "Failed to retrieve evaluation." });
  }
};
const getTestByJobId = async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: "Invalid job ID format" });
  }

  try {
    // Find the job by ID and populate the associated test forms
    const job = await Job.findById(jobId).populate("testForms");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!job.testForms || job.testForms.length === 0) {
      return res
        .status(404)
        .json({ message: "No test forms associated with this job" });
    }

    res.status(200).json({
      jobId: job._id,
      jobTitle: job.title, // Assuming the job schema includes a title field
      testForms: job.testForms.map((testForm) => ({
        id: testForm._id,
        title: testForm.title,
      })),
    });
  } catch (error) {
    console.error("Error fetching test by job ID:", error.message);
    res.status(500).json({ message: "Internal server error" });
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
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        const form = await Form.findById(formId)
            .select("title job_id")
            .populate("job_id");

        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        const submissions = await Submission.find({ formId })
            .populate({
                path: "applicantId",
                select: "email applications",
            })
            .limit(limitNumber)
            .skip((pageNumber - 1) * limitNumber)
            .exec();

        if (!submissions.length) {
            return res.status(404).json({ message: "No submissions found for this form" });
        }

        const jobId = form.job_id._id; // Correct access to the job ID
        const response = submissions.map((submission) => {
            const applicant = submission.applicantId;

            if (!applicant) {
                console.warn(`No applicant found for submission ID: ${submission._id}`);
                return {
                    submissionId: submission._id,
                    submittedAt: submission.createdAt,
                };
            }

            console.log(applicant, "Applicant Data");

            // Use the correct comparison for jobId
            const application = applicant.applications.find(application => {
                console.log("Comparing jobId:", jobId.toString(), "with application.jobId:", application.jobId.toString());
                return application.jobId && application.jobId.toString() === jobId.toString();
            });

            console.log(application, "aj");

            return {
                submissionId: submission._id,
                applicant: {
                    _id: applicant._id,
                    email: applicant.email,
                    applicationName: application ? application.name : null,
                },
                submittedAt: submission.createdAt,
            };
        });

        return res.status(200).json({
            total: submissions.length,
            submissions: response,
            formId: formId,
            title: form.title,
        });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
// const sendTestInvitesToAll = async (req, res) => {
//   const { jobId, applicantIds } = req.body;

//   // Fetch the job to get the associated testForm
//   const job = await Job.findById(jobId).populate('testForms');
//   if (!job) {
//       return res.status(404).json({ message: "Job not found." });
//   }

//   // Since there is only one test for each job, we can access the first element
//   const test = job.testForms[0];
//   if (!test) {
//       return res.status(404).json({ message: "No test associated with this job." });
//   }

//   const testInvites = [];

//   for (const applicantId of applicantIds) {
//       const applicant = await Applicants.findById(applicantId);
//       if (!applicant) {
//           continue; // Skip if applicant not found
//       }

//       const token = generateToken();
//       const testLink = new TestLink({
//           token,
//           testId: test._id,
//           userEmail: applicant.email,
//           createdAt: Date.now(),
//           used: false
//       });

//       await testLink.save();
//       const link = `https://yourdomain.com/test/${token}`; // Construct the test link

//       // Send the test invite email
//       await sendTestInviteEmail(applicant.email, test.title, link);

//       testInvites.push(link); // Collecting invites for logging or response
//   }

//   res.status(200).json({ message: "Test invites sent successfully", invites: testInvites });
// };

// // Implement the email sending function
// const sendTestInviteEmail = async (email, testTitle, link) => {
//   // Your email sending logic (e.g., using nodemailer)
//   console.log(`Sending email to: ${email}`);
//   console.log(`Test Title: ${testTitle}`);
//   console.log(`Test Link: ${link}`);

// };
const deleteTestForm = async (req, res) => {
  const { formId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(formId)) {
    return res.status(400).json({ message: "Invalid form ID format." });
  }

  try {
    // Find the test form to be deleted
    const form = await Form.findById(formId).populate('job_id'); // Populate job_id to access the job document

    if (!form) {
      return res.status(404).json({ message: "Form not found." });
    }

    await Form.findByIdAndDelete(formId);
    // Optionally, you can also clear references in other collections if required
    await Submission.deleteMany({ formId }); // Remove any submissions for this form
    await Evaluation.deleteMany({ formId }); // Remove any evaluations for this form

    res.status(200).json({ message: "Test form deleted successfully." });
  } catch (error) {
    console.error("Error deleting test form:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createTest,
  deleteTestForm,
  getFormById,
  updateForm,
  getApplicantsByFormId,
  getAllForms,
  submitForm,
  getTestByJobId,
  getEvaluationBySubmissionId,
};
