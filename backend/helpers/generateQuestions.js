const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateQuestions = async (request) => {
    console.log("Generating questions with request:", request);

    const prompt = `Generate exactly ${request.num_questions} technical ${request.interview_type} interview questions tailored for a ${request.experience_level}-level position in ${request.field}. Please ensure to write question statements complete and generate only ${request.interview_type} type questions and also ensure the questions match the specified experience level and considering human capabilities ensure they could be solved within ${request.interview_time}. Format the output as a numbered list with no additional headings, and include only the requested number of questions. Questions should be solvable within interview time. Provide only the questions.`;

    try {
        const result = await model.generateContent(prompt);
        console.log("AI Response for questions:", result);

        const questionsArray = result.response.text().split('\n').filter(q => q.trim() !== "");
        console.log("Parsed questions array:", questionsArray);

        const questions = [];
        for (let i = 0; i < questionsArray.length; i += 5) {
            const questionText = questionsArray[i].trim();
            const options = questionsArray.slice(i + 1, i + 5).map(opt => opt.trim());
            questions.push({
                question: questionText,
                options: options,
                answer: null,
                evaluation: {}
            });
        }

        return questions;
    } catch (error) {
        console.error("Error generating questions:", error);
        throw new Error('Question generation failed');
    }
};

const generateOptions = async (question) => {
    console.log("Generating options for question:", question);
    const optionsPrompt = `Provide 4 potential answer options (including one correct answer) for the following question: "${question}"`;

    try {
        const result = await model.generateContent(optionsPrompt);
        console.log("AI Response for options:", result);

        const optionsArray = result.response.text().split('\n').filter(opt => opt.trim() !== "").slice(0, 4); // Ensure only 4 options
        console.log("Parsed options array:", optionsArray);

        return optionsArray.map(opt => opt.trim());
    } catch (error) {
        console.error("Error generating options:", error);
        throw new Error('Options generation failed');
    }
};

module.exports = { generateQuestions, generateOptions };