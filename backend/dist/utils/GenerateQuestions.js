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
const generateQuestions = (language, level, numOfQuestions) => __awaiter(void 0, void 0, void 0, function* () {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
Generate ${numOfQuestions} unique ${level}-level coding questions in ${language}.
Each question should be a JSON object with:

- questionText: 1–2 sentence coding task
- sampleInput: example input (string)
- expectedOutput: expected output (string)

Return only a JSON array of objects. No explanation, no markdown, no backticks.
`;
    const result = yield model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith("```")) {
        text = text
            .replace(/^```[\w]*\n?/, "")
            .replace(/```$/, "")
            .trim();
    }
    return JSON.parse(text).slice(0, numOfQuestions);
});
exports.generateQuestions = generateQuestions;
//# sourceMappingURL=GenerateQuestions.js.map