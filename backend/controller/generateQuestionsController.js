const Test = require('../models/definations/questionModel');
const { generateQuestions,generateOptions } = require('../helpers/generateQuestions');
const { evaluateAnswersSequentially } = require('../helpers/evaluateAnswers');

const createTest = async (req, res) => {
    const { num_questions, interview_type, experience_level, field, interview_time, input_type } = req.body;

    console.log("Request to create test:", req.body); // Debugging line

    try {
        let questions;

        if (input_type === 'MCQs') {
            questions = await generateQuestions({ num_questions, interview_type, experience_level, field, interview_time });
            console.log("Generated questions:", questions); // Debugging line

            const questionsFormatted = [];

            for (const questionObj of questions) {
                const { options, correctAnswer } = await generateOptions(questionObj.question); // Get options and correct answer
                console.log("Generated options for question:", questionObj.question, "Options:", options); // Debugging line

                questionsFormatted.push({
                    question: questionObj.question, // Ensure this is a string
                    options: options, // Store options in the formatted question
                    answer: correctAnswer, // Store the correct answer
                    evaluation: {}
                });
            }

            const test = new Test({
                num_questions,
                interview_type,
                experience_level,
                field,
                interview_time,
                questions: questionsFormatted,
            });

            await test.save();
            console.log("Test created successfully:", test); // Debugging line
            res.status(201).json(test);
        } else {
            // Handle non-MCQ input types
            questions = await generateQuestions({ num_questions, interview_type, experience_level, field, interview_time });
            console.log("Generated questions for non-MCQ:", questions); // Debugging line

            const questionsFormatted = questions.map(q => ({
                question: q.question, // Ensure this is a string
                options: q.options || [], // Include options if they exist
                answer: null,
                evaluation: {}
            }));

            const test = new Test({
                num_questions,
                interview_type,
                experience_level,
                field,
                interview_time,
                questions: questionsFormatted,
            });

            await test.save();
            console.log("Test created successfully:", test); // Debugging line
            res.status(201).json(test);
        }
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
};

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