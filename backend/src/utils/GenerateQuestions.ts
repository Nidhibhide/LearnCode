import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const generateQuestions = async (
  language: string,
  level: string,
  numOfQuestions: number
) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

  const prompt = `
Generate ${numOfQuestions} unique ${level}-level coding questions in ${language}.
Each question should be a JSON object with:

- questionText: 1–2 sentence coding task
- sampleInput: example input (string)
- expectedOutput: expected output (string)

Return only a JSON array of objects. No explanation, no markdown, no backticks.
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  if (text.startsWith("```")) {
    text = text.replace(/^```[\w]*\n?/, "").replace(/```$/, "").trim();
  }

  return JSON.parse(text).slice(0, numOfQuestions);
};
