import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { handleError } from "../utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

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
      .filter((line) => line.length > 0)
      .slice(0, numOfQuestions);

    res.json(text);
   } catch (error) {
     console.error("Error generating content:", error);
     return handleError(res, "Failed to generate programming questions");
   }
};

export { generateQuestions };
