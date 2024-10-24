const Test = require('../models/definations/questionModel');
const { generateQuestions } = require('../helpers/generateQuestions');
const { evaluateAnswersSequentially } = require('../helpers/evaluateAnswers');


const createTest = async (req, res) => {
    const { num_questions, interview_type, experience_level, field, interview_time } = req.body;

    try {
        // Generate questions based on the input parameters
        const questions = await generateQuestions({ num_questions, interview_type, experience_level, field, interview_time });

        // Transform questions into the schema format
        const questionsFormatted = Object.values(questions).map(q => ({
            question: q,
            answer: null,
            evaluation: {}
        }));

        // Save the test to the database
        const test = new Test({
            num_questions,
            interview_type,
            experience_level,
            field,
            interview_time,
            questions: questionsFormatted,
        });

        await test.save(); // Wait for the test to be saved in the database
        res.status(201).json(test); // Respond with the created test
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' }); // Handle errors
    }
};

const getQuestionsForSession = async (session_id) => {
    try {
        const test = await Test.findById(session_id); // Fetch the test model by ID

        if (!test) {
            throw new Error('No test found for this session.');
        }

        // Ensure 'questions' is an array
        if (!Array.isArray(test.questions)) {
            throw new Error(`Questions are not in the expected array format. Got: ${typeof test.questions}`);
        }

        return test.questions; // Return the array of questions
    } catch (error) {
        console.error(`Error fetching questions for session ${session_id}:`, error.message);
        throw error; // Propagate the error to be handled at a higher level
    }
};

const submitAnswers = async (req, res) => {
    const { session_id } = req.params;
    const answers = req.body; // Expected format: { "1": "Answer to Q1", "2": "Answer to Q2", ... }

    try {
        // Fetch the test and questions for the session
        const test = await Test.findById(session_id);
        if (!test) {
            return res.status(404).json({ message: "Test session not found." });
        }

        const questions = test.questions;

        // Validate the number of answers
        if (Object.keys(answers).length !== questions.length) {
            return res.status(400).json({ message: `Expected ${questions.length} answers, but received ${Object.keys(answers).length}.` });
        }

        // Update the test document with the user's answers
        questions.forEach((q, index) => {
            const answerKey = (index + 1).toString(); // '1', '2', etc.
            const userAnswer = answers[answerKey];

            if (typeof userAnswer !== 'string') {
                throw new Error(`Invalid answer format for question ${index + 1}.`);
            }

            test.questions[index].answer = userAnswer.trim();
        });

        // Save the answers to the database before evaluation
        await test.save();

        // Evaluate the answers using the AI model
        const evaluations = await evaluateAnswersSequentially(questions, answers);

        // Update the test document with the evaluations
        questions.forEach((q, index) => {
            const questionKey = `Question ${index + 1}`;
            if (evaluations[questionKey]) {
                test.questions[index].evaluation = evaluations[questionKey];
            }
        });

        // Save the evaluations to the database
        await test.save();

        // Return the evaluations to the user
        return res.json(evaluations);
    } catch (error) {
        console.error("Error submitting answers:", error.message);
        return res.status(500).json({ message: error.message });
    }
};








module.exports = { createTest ,submitAnswers};
