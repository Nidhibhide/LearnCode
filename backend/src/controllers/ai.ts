import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

//no use still
const generateQuestions = async (req: Request, res: Response) => {
  const { language, level, numOfQuestions } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a programming question generator. Your task is to generate exactly ${numOfQuestions} unique ${level}-level coding questions in ${language}.

Each question must:
- Be 1–2 sentences long.
- Clearly describe a coding task that requires code to solve.
- Be output as a plain text list, one question per line, without numbering or bullet points.
- Avoid explanations, code examples, or formatting.
Respond with exactly ${numOfQuestions} lines.
`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();

    const text = textResponse
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Ensure correct count
    const trimmedText = text.slice(0, numOfQuestions);

    res.json(trimmedText);
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate programming questions" });
  }
};

// const generate = async (req: Request, res: Response) => {
//   const { title, language } = req.body;

//   const prompt = `Give a detailed coding problem for the title: "${title}" in ${language}.
// Include the following:
// - Problem Description
// - Input Format
// - Output Format
// - Constraints
// - Sample Input
// - Sample Output
// - Explanation
// - Related Concepts`;

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//         const response = text
//       .split("\n")
//       .map((line) => line.trim())
//       .filter((line) => line.length > 0);

//     res.json({ detail: response});
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Failed to get question detail" });
//   }
// };

export { generateQuestions };
