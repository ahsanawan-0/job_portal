const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"});

const generateQuestions = async (request) => {
    console.log("Generating questions with request:", request); // Log the request object for clarity

    let prompt;
    if (request.interview_type === 'MCQs') {

        prompt = `
        Generate exactly ${request.num_questions} technical MCQ interview questions tailored for a ${request.experience_level}-level position in ${request.field}. 
        Each question should be followed by 4 answer options (labeled a, b, c, and d) with a clear indication of which option is correct.
        The total interview time for these questions is ${request.interview_time} minutes. 
        Use the following format:
        
        1. Question text?
        a) Option 1
        b) Option 2
        c) Option 3
        d) Option 4
        Correct Answer: b) Option 2
        
        Make sure that:
        - The question is technical and related to the field specified.
        - Options are clear and concise.
        - The correct answer is indicated clearly at the end of each question.
        - There should be no additional headings or content, just the questions and answers as shown in the format.
        `;
    } else {
        prompt = `Generate exactly ${request.num_questions} technical ${request.interview_type} interview questions tailored for a ${request.experience_level}-level position in ${request.field}. The total interview time for these questions is ${request.interview_time} minutes. Format the output as a numbered list with no additional headings, and include only the requested number of questions.`;
    }

    try {
        
        const result = await model.generateContent(prompt);
        console.log("AI Response for questions:", result);

        
        const questionsArray = result.response.text().split('\n').filter(q => q.trim() !== "");
        console.log("Parsed questions array:", questionsArray);

        return questionsArray;
    } catch (error) {
        console.error("Error generating questions:", error); // Log any errors that occur during generation
        throw new Error('Question generation failed'); // Re-throw the error to handle it outside this function
    }
};

// const generateOptions = async (question) => {
//     console.log("Generating options for question:", question);
//     const optionsPrompt = `Provide 4 potential answer options (including one correct answer) for the following question: "${question}"`;

//     try {
//         const result = await model.generateContent(optionsPrompt);
//         console.log("AI Response for options:", result);

//         const optionsArray = result.response.text().split('\n').filter(opt => opt.trim() !== "").slice(0, 4); // Ensure only 4 options
//         console.log("Parsed options array:", optionsArray);

//         return optionsArray.map(opt => opt.trim());
//     } catch (error) {
//         console.error("Error generating options:", error);
//         throw new Error('Options generation failed');
//     }
// };

module.exports = { generateQuestions };