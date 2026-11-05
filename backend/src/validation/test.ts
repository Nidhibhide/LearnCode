import Joi from "joi";
import {
  numberValidator,
  selectValidator,
  stringValidator,
} from "../utils/GlobalValidation";
import { TEST_LANGUAGES, TEST_LEVELS } from "../constants";

const questionSchema = Joi.object({
  questionText: Joi.string().required().messages({
    "any.required": "Question text is required",
    "string.empty": "Question text is required",
  }),
  sampleInput: Joi.string().allow("").optional(),
  expectedOutput: Joi.string().required().messages({
    "any.required": "Expected output is required",
    "string.empty": "Expected output is required",
  }),
});

const TestValidation = Joi.object({
  name: stringValidator("Test Name", 3, 100, true),

  numOfQuestions: numberValidator("No of Questions", 1, 5, true),

  language: selectValidator("Test language", TEST_LANGUAGES, true),

  level: selectValidator("Test Level", TEST_LEVELS, true),

  // Optional: when provided (after preview), create uses these instead of regenerating
  questions: Joi.array().items(questionSchema).optional(),
});

const PreviewQuestionsValidation = Joi.object({
  numOfQuestions: numberValidator("No of Questions", 1, 5, true),
  language: selectValidator("Test language", TEST_LANGUAGES, true),
  level: selectValidator("Test Level", TEST_LEVELS, true),
});

// Edit allows updating test name only
const EditTestValidation = Joi.object({
  name: stringValidator("Test Name", 3, 100, true),
});

export { TestValidation, PreviewQuestionsValidation, EditTestValidation };
