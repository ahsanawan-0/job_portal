const { v4: uuidv4 } = require("uuid");
const reviewFormModel = require("../models/reviewFormModel");
const ReviewFormApplicant = require("../models/definations/reviewFormApplicantSchema");

module.exports = {
  createReviewFormForm: async (req, res) => {
    try {
      const { title, questions } = req.body;
      const form = await reviewFormModel.createReviewForm({
        title,
        questions,
        uniqueLinkId: uuidv4(),
      });

      return res.status(201).json({
        message: "Review form created",
        form,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },

  getAllReviewForms: async (req, res) => {
    const form = await reviewFormModel.getAllReviewForms();

    if (form.error) {
      return res.status(500).send({ error: form.error });
    }

    const simplifiedFormData = form.map((form) => ({
      id: form._id,
      formTitle: form.title,
      totalApplicants: form.applicants.length,
      uniqueLinkId: form.uniqueLinkId,
      applicants: form.applicants,
    }));

    return res.send({
      message: "All Review Forms",
      response: simplifiedFormData,
    });
  },

  getReviewFormById: async (req, res) => {
    const { uniqueLinkId } = req.params;
    const data = await reviewFormModel.getReviewFormById(uniqueLinkId);

    if (data.error) {
      return res.status(404).send({ error: data.error });
    }
    return res.send({
      message: "Review Form found",
      response: data,
    });
  },

  deleteReviewFormById: async (req, res) => {
    const { uniqueLinkId } = req.params;
    const result = await reviewFormModel.deleteReviewFormById(uniqueLinkId);

    if (result.error) {
      return res.status(404).send({ error: result.error });
    }

    return res.send({
      message: "Review Form Deleted Successfully",
    });
  },

  updateForm: async (req, res) => {
    const { uniqueLinkId, ...updateData } = req.body; // Destructure uniqueLinkId from req.body

    try {
      const updatedForm = await reviewFormModel.updateForm(
        uniqueLinkId,
        updateData
      );

      if (updatedForm.error) {
        return res.status(404).json({ error: updatedForm.error });
      }

      return res.status(200).json({
        message: "Review Form updated successfully",
        response: updatedForm,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },

  submitReviewForm: async (req, res) => {
    try {
      const { responses } = req.body;
      const uniqueLinkId = req.params.uniqueLinkId;
      console.log("Unique Link ID from params:", uniqueLinkId);

      if (!uniqueLinkId) {
        return res.status(400).json({ error: "uniqueLinkId is required" });
      }

      if (!responses) {
        return res.status(400).json({ error: "Responses are required" });
      }

      const answers = responses.map((response) => ({
        questionId: response.questionId,
        answer: response.answer,
      }));

      const newApplicant = new ReviewFormApplicant({
        answers,
      });

      await newApplicant.save();
      console.log(`Applicant submitted the review form.`);

      const updatedForm = await reviewFormModel.addApplicantToForm(
        uniqueLinkId,
        newApplicant._id
      );
      if (!updatedForm) {
        return res.status(404).json({ error: "Form not found" });
      }

      res.status(201).json({
        message: "Review form submitted successfully",
        applicant: newApplicant,
      });
    } catch (error) {
      console.error("Error submitting review form:", error);
      res.status(500).json({ error: "Error submitting review form" });
    }
  },

  getApplicantsByFormId: async (req, res) => {
    const { uniqueLinkId } = req.params;

    const applicants = await reviewFormModel.getApplicantsByFormId(
      uniqueLinkId
    );

    if (applicants.error) {
      return res.status(404).send({ error: applicants.error });
    }

    return res.send({
      message: "Applicants found",
      applicants: applicants.applicants,
      title: applicants.title,
      totalApplicants: applicants.totalApplicants,
    });
  },

  getApplicantQuestionsAndAnswers: async (req, res) => {
    const { applicantId } = req.params;

    try {
      const result = await reviewFormModel.getApplicantDetailsWithQuestions(
        applicantId
      );

      if (result.error) {
        return res.status(404).json({ error: result.error });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  deleteReviewApplicant: async (req, res) => {
    const { applicantId } = req.params;

    try {
      const response = await reviewFormModel.deleteReviewApplicant(applicantId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};
