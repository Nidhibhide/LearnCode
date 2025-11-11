"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const GlobalValidation_1 = require("../utils/GlobalValidation");
const TEST_LANGUAGES = ["Java", "C++", "JavaScript", "Python", "C"];
const TEST_LEVELS = ["Basic", "Intermediate", "Advanced"];
const TestValidation = joi_1.default.object({
    name: (0, GlobalValidation_1.stringValidator)("Test Name", 3, 100, true),
    numOfQuestions: (0, GlobalValidation_1.numberValidator)("No of Questions", 1, 5, true),
    language: (0, GlobalValidation_1.selectValidator)("Test language", TEST_LANGUAGES, true),
    level: (0, GlobalValidation_1.selectValidator)("Test Level", TEST_LEVELS, true),
});
exports.TestValidation = TestValidation;
//# sourceMappingURL=test.js.map