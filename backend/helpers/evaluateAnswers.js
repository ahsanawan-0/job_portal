const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate feedback from the evaluation model
const generateFeedback = async (prompt) => {
    try {
        const response = await model.generateContent(prompt);
        const feedbackText = typeof response.response.text === 'function' 
            ? await response.response.text() 
            : response.response.text;

        if (typeof feedbackText !== 'string') {
            throw new Error('Feedback received is not a string.');
        }

        return feedbackText;
    } catch (error) {
        console.error('Error generating feedback:', error.message);
        throw new Error('Failed to generate feedback from the model.');
    }
};

// Helper function to evaluate the answer
const evaluateAnswer = async (question, answer) => {
    const experience_level = "1 year"; // Hardcoded experience level
    const prompt = `
Evaluate the following answer to the question '${question}' considering the experience level of the candidate (${experience_level}). Ensure to provide a complete statement, remark, and percentage.

Provide the evaluation in the following plain text format without any Markdown or special formatting:

1. Correctness Percentage: <percentage>
2. Remark: <your remark here>

Answer:
${answer}

Evaluation:
`;

    try {
        const feedback = await generateFeedback(prompt);
        console.log("Feedback Received:", feedback);

        // Remove Markdown syntax using regex
        const plainTextFeedback = feedback.replace(/\*\*/g, '').replace(/##\s+/g, '').trim();

        // Attempt to parse the feedback
        const correctnessMatch = plainTextFeedback.match(/1\.\s*Correctness Percentage:\s*(\d+)%/i);
        const remarkMatch = plainTextFeedback.match(/2\.\s*Remark:\s*([\s\S]*?)(?:\n|$)/i);

        if (correctnessMatch && remarkMatch) {
            return {
                correctnessPercentage: parseInt(correctnessMatch[1], 10),
                remark: remarkMatch[1].trim(),
            };
        } else {
            console.warn('Failed to parse evaluation components from the feedback.');
            return {
                correctnessPercentage: 0,
                remark: "Unable to evaluate the answer.",
            };
        }
    } catch (error) {
        console.error('Error in evaluateAnswer:', error.message);
        return {
            correctnessPercentage: 0,
            remark: "Error during evaluation.",
        };
    }
};

// Function to evaluate answers sequentially
const evaluateAnswersSequentially = async (questions, answers) => {
    const evaluations = {};

    for (let i = 0; i < questions.length; i++) {
        const questionNumber = (i + 1).toString(); 
        const questionObj = questions[i];
        const userAnswer = answers[i] && answers[i].answer;

        const questionKey = `Question ${questionNumber}`;

        if (!userAnswer || userAnswer.trim() === "") {
            console.warn(`Missing answer for ${questionKey}: ${questionObj.question}`);
            evaluations[questionKey] = {
                correctnessPercentage: 0,
                remark: "No answer provided.",
            };
            continue; 
        }

        try {
            if (questionObj.options && questionObj.options.length > 0) {
                // Handling MCQ
                const isCorrect = userAnswer.trim().toLowerCase() === questionObj.correctAnswer.toLowerCase();
                evaluations[questionKey] = {
                    correctnessPercentage: isCorrect ? 100 : 0,
                    remark: isCorrect ? "Correct answer." : "Incorrect answer.",
                };
            } else {
                // Handling non-MCQ
                const evaluation = await evaluateAnswer(questionObj.question, userAnswer);
                evaluations[questionKey] = evaluation;
            }
        } catch (error) {
            console.error(`Error evaluating ${questionKey}:`, error.message);
            evaluations[questionKey] = {
                correctnessPercentage: 0,
                remark: "Error in evaluation.",
            };
        }
    }

    return evaluations;
};;

module.exports = { evaluateAnswersSequentially };
