// helpers/questionHelper.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateQuestions = async (request) => {
    const prompt = `Generate exactly ${request.num_questions} technical ${request.interview_type} interview questions tailored for a ${request.experience_level}-level position in ${request.field}. Please ensure to write question statements complete and generate only ${request.interview_type} type questions and also ensure the questions match the specified experience level and considering human capabilities ensure they could be solved within ${request.interview_time}. Format the output as a numbered list with no additional headings, and include only the requested number of questions. Questions should be solvable within interview time. Provide only the questions.`;

    try {
        const result = await model.generateContent(prompt);
        const questionsArray = result.response.text().split('\n').filter(q => q.trim() !== ""); // Filter out any empty lines

        // Create a key-value pair object for questions
        const questions = {};
        questionsArray.forEach((question, index) => {
            questions[`Question ${index + 1}`] = question; // e.g., 'Question 1': 'What is your name?'
        });

        return questions; // Return the questions in key-value format
    } catch (error) {
        console.error("Error generating questions:", error);
        throw new Error('Question generation failed');
    }
};

module.exports = { generateQuestions };
