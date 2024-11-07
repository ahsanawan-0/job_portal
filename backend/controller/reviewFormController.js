const { v4: uuidv4 } = require("uuid");
const reviewFormModel = require("../models/reviewFormModel");

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
};
