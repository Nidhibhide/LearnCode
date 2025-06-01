"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const QuestionSchema = new mongoose_1.default.Schema({
    questionText: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    sampleInput: { type: String }, // optional
});
const TestSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    numOfQuestions: { type: Number, required: true },
    language: {
        type: String,
        enum: ["Java", "C++", "JavaScript", "Python", "C"],
        required: true,
    },
    level: {
        type: String,
        enum: ["Basic", "Intermediate", "Advanced"],
        required: true,
    },
    questions: [QuestionSchema], // embedded on creation
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const TestModel = mongoose_1.default.model("Test", TestSchema);
exports.default = TestModel;
//# sourceMappingURL=test.js.map