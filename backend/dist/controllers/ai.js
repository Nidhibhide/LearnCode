"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuestions = void 0;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const generateQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield model.generateContent(prompt);
        const textResponse = result.response.text();
        const text = textResponse
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        // Ensure correct count
        const trimmedText = text.slice(0, numOfQuestions);
        res.json(trimmedText);
    }
    catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Failed to generate programming questions" });
    }
});
exports.generateQuestions = generateQuestions;
//# sourceMappingURL=ai.js.map