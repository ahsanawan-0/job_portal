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

      // Check if the form exists
      if (!form) {
        throw new Error("Form not found");
      }

      // If the form exists, proceed to add the applicant ID
      const updatedForm = await Interview.findOneAndUpdate(
        { uniqueLinkId },
        { $addToSet: { applicants: applicantId } }, // Use $addToSet to avoid duplicates
        { new: true }
      );

      return updatedForm; // Return the updated form
    } catch (error) {
      console.error(`Error adding applicant to form: ${error.message}`);
      throw error;
    }
  },
};
