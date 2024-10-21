const ExitInterview = require('../models/definations/ExitInterviewSchema');
const { v4: uuidv4 } = require('uuid');

// Create a new exit interview form
module.exports={

    createExitInterviewForm : async (req, res) => {
        try {
          const { title, questions } = req.body;
      
          const form = new ExitInterview({
            title,
            questions,
            uniqueLinkId: uuidv4(), 
          });
      
          await form.save();
          res.status(201).json({ message: 'Exit Interview form created', form });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
      getFormById : async (req, res) => {
        try {
          const { id } = req.params;
          const form = await ExitInterview.findOne({ uniqueLinkId: id });
      
          if (!form) {
            return res.status(404).json({ message: 'Form not found' });
          }
      
          res.status(200).json(form);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
      submitFormResponses : async (req, res) => {
        try {
          const { formId, responses } = req.body;
          const form = await ExitInterview.findOne({ uniqueLinkId: formId });
      
          if (!form) {
            return res.status(404).json({ message: 'Form not found' });
          }
      
          // Handle submission logic (e.g., save responses to DB or send email)
      
          res.status(200).json({ message: 'Form responses submitted' });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
}

