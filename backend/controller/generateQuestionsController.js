const Test = require('../models/definations/questionModel');
const { generateQuestions,generateOptions } = require('../helpers/generateQuestions');
const { evaluateAnswersSequentially } = require('../helpers/evaluateAnswers');
const createTest = async (req, res) => {
    const { num_questions, interview_type, experience_level, field, interview_time } = req.body;

    try {
        const questions = await generateQuestions({ num_questions, interview_type, experience_level, field, interview_time });

        const questionsFormatted = [];
        let currentQuestion = null;
        let currentOptions = [];
        let correctAnswer = null;

        questions.forEach((line) => {
            const trimmedLine = line.trim();

            // Identify a new question based on numbered format (e.g., "1. Question text")
            const questionMatch = trimmedLine.match(/^\d+\.\s(.*)/);
            const optionMatch = trimmedLine.match(/^[a-d]\)\s(.*)/);
            const correctAnswerMatch = trimmedLine.match(/Correct Answer:\s*([a-d])\)\s(.*)/);

            if (questionMatch) {
                // Save the previous question if it exists
                if (currentQuestion) {
                    questionsFormatted.push({
                        question: currentQuestion,
                        options: currentOptions,
                        answer: correctAnswer || currentOptions[0],
                        evaluation: {}
                    });
                }

                // Start a new question
                currentQuestion = questionMatch[1];
                currentOptions = [];
                correctAnswer = null;
            } else if (optionMatch && currentQuestion) {
                // Add options to the current question
                currentOptions.push(optionMatch[1]);
            } else if (correctAnswerMatch && currentQuestion) {
                // Capture the correct answer from the AI-generated content
                const answerIndex = correctAnswerMatch[1].charCodeAt(0) - 'a'.charCodeAt(0);
                correctAnswer = currentOptions[answerIndex];
            }
        });

        // Save the last question if there is one
        if (currentQuestion) {
            questionsFormatted.push({
                question: currentQuestion,
                options: currentOptions,
                answer: correctAnswer || currentOptions[0],
                evaluation: {}
            });
        }

        // Create and save the test
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




// Function to separate question and options
function separateQuestionAndOptions(input) {
    // Check if input is an array
    if (!Array.isArray(input)) {
        throw new TypeError('Input must be an array');
    }

    // The first element is the question
    const question = input[0].trim();

    // The rest are the options
    const options = input.slice(1).map(option => option.trim());

    return {
        question,
        options
    };
}

// Function to separate question and options
function separateQuestionAndOptions(input) {
    // The first element is the question
    const question = input[0].trim();

    // The rest are the options
    const options = input.slice(1).map(option => option.trim());

    return {
        question,
        options
    };
}

module.exports = createTest;

module.exports = createTest;
// const createTest = async (req, res) => {
//     const { num_questions, interview_type, experience_level, field, interview_time, input_type } = req.body;

//     try {
//         let questions;

//         // Check if the input type is MCQs
//         if (input_type === 'MCQs') {
//             questions = await generateQuestions({ num_questions, interview_type, experience_level, field, interview_time });
//             const questionsFormatted = [];

//             // Populate each question and its options
//             for (const question of Object.values(questions)) {
//                 const options = await generateOptions(question); // Get options for the question
//                 console.log(options)
//                 questionsFormatted.push({
//                     question: question,
//                     options: options, // Store options in the formatted question
//                     answer: null,
//                     evaluation: {}
//                 });
//             }

//             const test = new Test({
//                 num_questions,
//                 interview_type,
//                 experience_level,
//                 field,
//                 interview_time,
//                 questions: questionsFormatted,
//             });

//             await test.save();
//             res.status(201).json(test);
//         } else {
//             // Handle non-MCQ input types (e.g., coding questions)
//             questions = await generateQuestions({ num_questions, interview_type, experience_level, field, interview_time });
//             const questionsFormatted = Object.values(questions).map(q => ({
//                 question: q,
//                 answer: null,
//                 evaluation: {}
//             }));

//             const test = new Test({
//                 num_questions,
//                 interview_type,
//                 experience_level,
//                 field,
//                 interview_time,
//                 questions: questionsFormatted,
//             });

//             await test.save();
//             res.status(201).json(test);
//         }
//     } catch (error) {
//         console.error('Error creating test:', error);
//         res.status(500).json({ error: 'Failed to create test' });
//     }
// };

// Retrieve all questions for a specific test
const getAllQuestions = async (req, res) => {
    const { test_id } = req.params; // Using test_id instead of session_id

    try {
        const test = await Test.findById(test_id).populate('questions');
        if (!test) {
            return res.status(404).json({ message: "Test not found." });
        }

        return res.json(test.questions);
    } catch (error) {
        console.error("Error retrieving questions:", error.message);
        return res.status(500).json({ message: error.message });
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

        // Remove the question at the specified index
        test.questions.splice(question_index, 1);
        test.num_questions = test.questions.length; // Update num_questions

        await test.save(); // Save the updated test document

        return res.json({ message: "Question deleted successfully." });
    } catch (error) {
        console.error("Error deleting question:", error.message);
        return res.status(500).json({ message: error.message });
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






module.exports = { createTest, getAllQuestions, deleteQuestion,submitAnswers };