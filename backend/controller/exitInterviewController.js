const ExitInterview = require("../models/definations/ExitInterviewSchema");
const exitInterviewModel = require("../models/exitInterviewModel");
const Applicant = require("../models/definations/exitApplicantSchema");

const { v4: uuidv4 } = require("uuid");

// Create a new exit interview form
module.exports = {
  createExitInterviewForm: async (req, res) => {
    try {
      const { title, questions } = req.body;

      // Call the model function to create the form
      const form = await exitInterviewModel.createExitInterviewForm({
        title,
        questions,
        uniqueLinkId: uuidv4(),
      });

      return res.status(201).json({
        message: "Exit Interview form created",
        form,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },

  // submitFormResponses: async (req, res) => {
  //   try {
  //     const { formId, responses } = req.body;
  //     const form = await ExitInterview.findOne({ uniqueLinkId: formId });

  //     if (!form) {
  //       return res.status(404).json({ message: "Form not found" });
  //     }

  //     res.status(200).json({ message: "Form responses submitted" });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // },
  getAllExitInterviewForms: async (req, res) => {
    const form = await exitInterviewModel.getAllExitInterviewForms();

    if (form.error) {
      return res.send({
        error: form.error,
      });
    }

    const simplifiedFormData = form.map((form) => ({
      id: form._id,
      formTitle: form.title,
      totalApplicants: form.applicants.length,
      uniqueLinkId: form.uniqueLinkId,

      applicants: form.applicants,
    }));

    return res.send({
      message: "All Exit Interview Forms",
      response: simplifiedFormData,
    });
  },
  getFormById: async (req, res) => {
    const { uniqueLinkId } = req.params;
    console.log(uniqueLinkId);
    const data = await exitInterviewModel.getFormById(uniqueLinkId);

    if (data.error) {
      return res.status(404).send({
        error: data.error,
      });
    }
    return res.send({
      message: "Exit Interview Form found",
      response: data,
    });
  },

  submitExitInterview: async (req, res) => {
    try {
      const { employeeName, employeeId, responses } = req.body;
      console.log("in controller name", employeeName);
      console.log("in controller id", employeeId);
      const uniqueLinkId = req.params.uniqueLinkId;
      console.log("Unique Link ID from params:", uniqueLinkId);
      // Check for formId
      if (!uniqueLinkId) {
        return res.status(400).json({ error: "uniqueLinkId is required" });
      }

      if (!employeeName || !employeeId || !responses) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const answers = responses.map((response) => ({
        questionId: response.questionId,
        answer: response.answer,
      }));

      const newApplicant = new Applicant({
        employeeName,
        employeeId,
        answers,
      });

      await newApplicant.save();
      console.log(`Applicant ${employeeName} submitted the exit interview.`);

      const updatedForm = await exitInterviewModel.addApplicantToForm(
        uniqueLinkId,
        newApplicant._id
      );
      if (!updatedForm) {
        return res.status(404).json({ error: "Form not found" });
      }

      res.status(201).json({
        message: "Exit interview submitted successfully",
        applicant: newApplicant,
      });
    } catch (error) {
      console.error("Error submitting exit interview:", error);
      res.status(500).json({ error: "Error submitting exit interview" });
    }
  },
};
