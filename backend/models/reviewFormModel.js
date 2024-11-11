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

  updateForm: async (uniqueLinkId, updateData) => {
    try {
      const updatedForm = await ReviewForm.findOneAndUpdate(
        { uniqueLinkId },
        {
          title: updateData.title,
          questions: updateData.questions.map((question) => {
            return {
              _id: question._id,
              label: question.label,
              type: question.type,
              options: question.type === "radio" ? question.options : [],
            };
          }),
        },
        { new: true, runValidators: true }
      );

      if (!updatedForm) {
        return { error: "Review Form not found" };
      }

      for (const question of updateData.questions) {
        if (question.type === "radio") {
          const existingQuestion = updatedForm.questions.id(question._id);
          if (existingQuestion) {
            existingQuestion.options = question.options;
          }
        }
      }
      await updatedForm.save();
      return updatedForm;
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },

  addApplicantToForm: async (uniqueLinkId, applicantId) => {
    try {
      const form = await ReviewForm.findOne({ uniqueLinkId });

      if (!form) {
        throw new Error("Form not found");
      }

      const updatedForm = await ReviewForm.findOneAndUpdate(
        { uniqueLinkId },
        { $addToSet: { applicants: applicantId } },
        { new: true }
      );
      return updatedForm;
    } catch (error) {
      console.error(`Error adding applicant to form: ${error.message}`);
      throw error;
    }
  },

  getApplicantsByFormId: async (uniqueLinkId) => {
    try {
      const formWithApplicants = await ReviewForm.findOne({ uniqueLinkId })
        .populate("applicants")
        .exec();

      if (!formWithApplicants) {
        return { error: "Form not found" };
      }

      const applicants = formWithApplicants.applicants.map((applicant) => ({
        id: applicant._id,
        answers: applicant.answers,
      }));

      return {
        title: formWithApplicants.title,
        applicants,
        totalApplicants: applicants.length,
      };
    } catch (error) {
      return { error: error.message };
    }
  },

  getApplicantDetailsWithQuestions: async (applicantId) => {
    try {
      const applicant = await ReviewFormApplicant.findById(applicantId);
      if (!applicant) {
        return { error: "Applicant not found" };
      }

      const reviewForm = await ReviewForm.findOne({ applicants: applicantId });

      if (!reviewForm) {
        return { error: "Review form not found" };
      }
      const formattedAnswers = applicant.answers.map((answer) => {
        const question = reviewForm.questions.find(
          (q) => q._id.toString() === answer.questionId.toString()
        );

        const questionDetails = {
          question: question ? question.label : "Question not found",
          answer: answer.answer,
        };

        if (question && question.type === "radio") {
          questionDetails.options = question.options;
        }

        return questionDetails;
      });

      return {
        applicantId: applicant._id,
        answers: formattedAnswers,
      };
    } catch (error) {
      return { error: error.message };
    }
  },

  deleteReviewApplicant: async (applicantId) => {
    try {
      const applicant = await ReviewFormApplicant.findByIdAndDelete(
        applicantId
      );
      if (!applicant) {
        throw new Error("Applicant not found");
      }

      await ReviewForm.updateMany(
        { applicants: applicantId },
        { $pull: { applicants: applicantId } }
      );

      return { message: "Applicant deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
