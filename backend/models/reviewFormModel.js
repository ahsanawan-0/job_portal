const ReviewForm = require("./definations/reviewFormSchema");
const ReviewFormApplicant = require("./definations/reviewFormApplicantSchema");

module.exports = {
  createReviewForm: async ({ title, questions, uniqueLinkId }) => {
    try {
      const form = new ReviewForm({
        title,
        questions,
        uniqueLinkId,
      });

      return await form.save();
    } catch (error) {
      throw new Error("Failed to create review form: " + error.message);
    }
  },

  getAllReviewForms: async () => {
    try {
      const data = await ReviewForm.find({}).sort({ createdAt: -1 }).exec();
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  getReviewFormById: async (uuid) => {
    try {
      const data = await ReviewForm.findOne({ uniqueLinkId: uuid });
      if (!data) {
        return { error: "Form not found" };
      }
      return data;
    } catch (error) {
      return { error: error.message };
    }
  },

  deleteReviewFormById: async (uuid) => {
    try {
      const form = await ReviewForm.findOne({ uniqueLinkId: uuid });
      if (!form) {
        return { error: "Form not found" };
      }

      await ReviewFormApplicant.deleteMany({ _id: { $in: form.applicants } });
      await ReviewForm.findByIdAndDelete(form._id);

      return { message: "Form and associated applicants deleted successfully" };
    } catch (error) {
      return { error: error.message };
    }
  },
};
