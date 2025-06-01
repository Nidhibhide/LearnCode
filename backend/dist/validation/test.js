"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const GlobalValidation_1 = require("../utils/GlobalValidation");
const TestValidation = joi_1.default.object({
    name: (0, GlobalValidation_1.stringValidator)("Test Name", 3, 100, true),
    numOfQuestions: (0, GlobalValidation_1.numberValidator)("No of Questions", 1, 5, true),
    language: (0, GlobalValidation_1.selectValidator)("Test language", ["Java", "C++", "JavaScript", "Python", "C"], true),
    level: (0, GlobalValidation_1.selectValidator)("Test Level", ["Basic", "Intermediate", "Advanced"], true),
});
exports.TestValidation = TestValidation;
//# sourceMappingURL=test.js.map