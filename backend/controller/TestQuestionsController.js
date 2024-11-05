const Test = require('../models/definations/questionSchema');
const { generateQuestions, } = require('../helpers/generateQuestions');
const { evaluateAnswersSequentially } = require('../helpers/evaluateAnswers');

// Create a test
const createQuestions = async (req, res) => {
    const { num_questions, interview_type, experience_level, field, interview_time } = req.body;

    try {
        const questions = await generateQuestions({ num_questions, interview_type, experience_level, field, interview_time });

        const questionsFormatted = [];

        questions.forEach((line) => {
            const trimmedLine = line.trim();

            // Identify a new question based on numbered format
            const questionMatch = trimmedLine.match(/^\d+\.\s(.*)/);
            const optionMatch = trimmedLine.match(/^[a-d]\)\s(.*)/);
            const correctAnswerMatch = trimmedLine.match(/Correct Answer:\s*([a-d])\)\s(.*)/);

            if (questionMatch) {
                // Prepare a new question object
                const questionObject = {
                    question: questionMatch[1],
                    options: [],
                    correctAnswer: null, // Will be set below
                };

                // If the question has options, push them
                if (optionMatch) {
                    questionObject.options.push(optionMatch[1]);
                }

                questionsFormatted.push(questionObject);
            } else if (optionMatch) {
                // Add options to the last question
                const lastQuestion = questionsFormatted[questionsFormatted.length - 1];
                if (lastQuestion) {
                    lastQuestion.options.push(optionMatch[1]);
                }
            } else if (correctAnswerMatch) {
                // Set the correct answer for the last question
                const answerIndex = correctAnswerMatch[1].charCodeAt(0) - 'a'.charCodeAt(0);
                const lastQuestion = questionsFormatted[questionsFormatted.length - 1];
                if (lastQuestion) {
                    lastQuestion.correctAnswer = lastQuestion.options[answerIndex];
                }
            }
        });

        const test = new Test({
            num_questions,
            interview_type,
            experience_level,
            field,
            interview_time,
            questions: questionsFormatted,
        });

        await test.save();
        res.status(201).json(test);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create test' });
    }
};

// Retrieve all questions for a specific test
const getQuestionsById = async (req, res) => {
    const { question_id } = req.params;

    try {
        const test = await Test.findById(question_id).populate('questions');
        if (!test) {
            return res.status(404).json({ message: "Test not found." });
        }

        return res.json(test.questions);
    } catch (error) {
        console.error("Error retrieving questions:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

// Delete a specific test by ID
const deleteGeneratedQuestion = async (req, res) => {
    const { question_id } = req.params;

    try {
        const deletedTest = await Test.findByIdAndDelete(question_id);
        
        if (!deletedTest) {
            return res.status(404).json({ message: "generated questions not found." });
        }

        return res.status(200).json({ message: "Questions deleted successfully." });
    } catch (error) {
        console.error("Error deleting test:", error.message);
        return res.status(500).json({ message: "Failed to delete test." });
    }
};

const getAllGeneratedQuestions = async (req, res) => {
    try {
        const tests = await Test.find({}, 'num_questions interview_type experience_level field createdAt'); // Select specific fields
        res.status(200).json(tests); // Respond with the list of tests
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tests' });
    }
};
// Delete a specific question
const deleteQuestion = async (req, res) => {
    const { test_id, question_index } = req.params;

    try {
        const test = await Test.findById(test_id);
        if (!test) {
            return res.status(404).json({ message: "Test not found." });
        }

        if (question_index < 0 || question_index >= test.questions.length) {
            return res.status(404).json({ message: "Question not found." });
        }

        test.questions.splice(question_index, 1);
        test.num_questions = test.questions.length;

        await test.save();

        return res.json({ message: "Question deleted successfully." });
    } catch (error) {
        console.error("Error deleting question:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { createQuestions, getAllGeneratedQuestions, deleteQuestion,getQuestionsById,deleteGeneratedQuestion};
