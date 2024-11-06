const mongoose = require("mongoose");
const Submission = require("../models/definations/submisionSchema");
const Applicants = require("../models/definations/applicantsSchema");
const Form = require("../models/definations/TestFormSchema");
const createForm = async (req, res) => {
  const { title, questions, duration } = req.body;
  try {
    const newForm = new Form({ title, questions, duration });
    await newForm.save();
    res
      .status(201)
      .json({ message: "Form created successfully", form: newForm });
  } catch (error) {
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

const submitForm = async (req, res) => {
  const { name, email, questions } = req.body;
  const formId = req.params.formId;

  console.log("Incoming Form Data:", req.body);

  try {
    let applicant = await Applicants.findOne({ email });
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

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
      form.applicants.push(applicant._id); // Link the applicant to the form
      await form.save(); // Save the updated form with applicants
    }

    // Optionally, create an evaluation entry here
    // await evaluateApplicant(applicant._id, formId, questions);

    return res
      .status(200)
      .json({ message: "Submission successful", submission });
  } catch (error) {
    console.error("Error during form submission:", error);
    return res.status(500).json({ message: "Internal server error" });
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

const submitAnswers = async (req, res) => {
  const { session_id } = req.params;
  const answers = req.body;

  try {
    const test = await Test.findById(session_id);
    if (!test) {
      return res.status(404).json({ message: "Test session not found." });
    }

    const questions = test.questions;

    if (Object.keys(answers).length !== questions.length) {
      return res
        .status(400)
        .json({
          message: `Expected ${questions.length} answers, but received ${
            Object.keys(answers).length
          }.`,
        });
    }

    questions.forEach((q, index) => {
      const answerKey = (index + 1).toString();
      const userAnswer = answers[answerKey];

      if (typeof userAnswer !== "string") {
        throw new Error(`Invalid answer format for question ${index + 1}.`);
      }

      test.questions[index].answer = userAnswer.trim();
    });

    await test.save();

    const evaluations = await evaluateAnswersSequentially(questions, answers);

    questions.forEach((q, index) => {
      const questionKey = `Question ${index + 1}`;
      if (evaluations[questionKey]) {
        test.questions[index].evaluation = evaluations[questionKey];
      }
    });

    await test.save();

    return res.json(evaluations);
  } catch (error) {
    console.error("Error submitting answers:", error.message);
    return res.status(500).json({ message: error.message });
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

const getSubmissionWithQuestions = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Fetch the associated form using formId
    const form = await Form.findById(submission.formId); // Ensure formId corresponds to Form ID
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Prepare response data
    const results = form.questions.map((question) => {
      const answer = submission.answers.find(
        (a) => a.questionId.toString() === question._id.toString()
      );
      return {
        questionId: question._id,
        questionText: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        givenAnswer: answer ? answer.answer : null,
        isCorrect: answer ? answer.answer === question.correctAnswer : null,
      };
    });

    const response = {
      submissionId: submission.id,
      applicantId: submission.applicantId,
      formId: submission.formId,
      results: results,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching submission:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createForm,
  getFormById,
  updateForm,
  getApplicantsByFormId,
  getAllForms,
  getSubmissionWithQuestions,
  submitForm,
  submitAnswers,
};
