const applicant = require("./definations/applicantsSchema");

module.exports = {
  getAllApplications: async () => {
    try {
      const applicants = await applicant.find({});
      //   console.log("in model", applicants);
      if (applicants.error) {
        return {
          error: applicants.error,
        };
      }
      return {
        response: applicants,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  },

}

