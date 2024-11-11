const mongoose = require("mongoose");
const exitInterviewSchema = require("./definations/ExitInterviewSchema");
const Interview = mongoose.model("ExitInterview", exitInterviewSchema);
const exitApplicant = require("./definations/exitApplicantSchema");

module.exports = {
  createExitInterviewForm: async ({ title, questions, uniqueLinkId }) => {
    try {
      const form = new Interview({
        title,
        questions,
        uniqueLinkId,
      });

      await form.save();
      return form;
    } catch (error) {
      return { error: error.message };
    }
  },

  getAllExitInterviewForms: async () => {
    try {
      const data = await Interview.find({}).sort({ createdAt: -1 }).exec();

      if (data.error) {
        return {
          error: data.error,
        };
      }

      return data;
    } catch (error) {
      return {
        error: error,
      };
    }
  },
  getFormById: async (uuid) => {
    try {
      const data = await Interview.findOne({ uniqueLinkId: uuid });

      if (!data) {
        return { error: "Form not found" };
      }
      return data;
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },

  addApplicantToForm: async (uniqueLinkId, applicantId) => {
    try {
      const form = await Interview.findOne({ uniqueLinkId });

      if (!form) {
        throw new Error("Form not found");
      }

      const updatedForm = await Interview.findOneAndUpdate(
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

  deleteFormById: async (uuid) => {
    try {
      const form = await Interview.findOne({ uniqueLinkId: uuid });

      if (!form) {
        return { error: "Form not found" };
      }

      await exitApplicant.deleteMany({ _id: { $in: form.applicants } });

      await Interview.findByIdAndDelete(form._id);

      return { message: "Form and associated applicants deleted successfully" };
    } catch (error) {
      return { error: error.message };
    }
  },

  getApplicantsByFormId: async (uniqueLinkId, page, limit) => {
    try {
      const formWithApplicants = await Interview.findOne({ uniqueLinkId })
        .populate({
          path: "applicants",
          options: {
            sort: { createdAt: -1 },
            skip: (page - 1) * limit,
            limit: parseInt(limit),
          },
        })
        .exec();

      const interview = await Interview.findOne({ uniqueLinkId }).populate(
        "applicants"
      );
      const totalApplicants = interview.applicants.length;
      if (!formWithApplicants) {
        return { error: "Form not found" };
      }

      const applicants = formWithApplicants.applicants.map((applicant) => ({
        id: applicant._id,
        employeeName: applicant.employeeName,
        employeeId: applicant.employeeId,
      }));

      return { title: formWithApplicants.title, applicants, totalApplicants };
    } catch (error) {
      return { error: error.message };
    }
  },

  getApplicantDetailsWithQuestions: async (applicantId) => {
    try {
      const applicant = await exitApplicant.findById(applicantId);

      if (!applicant) {
        return { error: "Applicant not found" };
      }

      const interviewForm = await Interview.findOne({
        applicants: applicantId,
      });

      if (!interviewForm) {
        return { error: "Interview form not found" };
      }

      const formattedAnswers = applicant.answers.map((answer) => {
        const question = interviewForm.questions.find(
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
        employeeName: applicant.employeeName,
        employeeId: applicant.employeeId,
        answers: formattedAnswers,
      };
    } catch (error) {
      return { error: error.message };
    }
  },

  deleteExitApplicant: async (applicantId) => {
    try {
      const applicant = await exitApplicant.findByIdAndDelete(applicantId);
      if (!applicant) {
        throw new Error("Applicant not found");
      }

      await Interview.updateMany(
        { applicants: applicantId },
        { $pull: { applicants: applicantId } }
      );

      return { message: "Applicant deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateForm: async (uniqueLinkId, updateData) => {
    try {
      const updatedForm = await Interview.findOneAndUpdate(
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
        return { error: "Form not found" };
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
};
