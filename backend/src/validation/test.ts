import Joi from "joi";
import {
  numberValidator,
  selectValidator,
  stringValidator,
} from "../utils/GlobalValidation";
import { TEST_LANGUAGES, TEST_LEVELS } from "../constants";

const questionSchema = Joi.object({
  questionText: Joi.string().required().messages({
    "any.required": "Question is required",
    "string.empty": "Question is required",
  }),
  sampleInput: Joi.string().allow("").optional(),
  expectedOutput: Joi.string().required().messages({
    "any.required": "Expected output is required",
    "string.empty": "Expected output is required",
  }),
});

const TestValidation = Joi.object({
  name: stringValidator("Test Name", 3, 100, true),

  // AI create uses <=5; CSV import can be higher (up to 50)
  numOfQuestions: numberValidator("No of Questions", 1, 50, true),

  language: selectValidator("Test language", TEST_LANGUAGES, true),

  level: selectValidator("Test Level", TEST_LEVELS, true),

  // Optional: when provided (after preview), create uses these instead of regenerating
  questions: Joi.array()
    .items(questionSchema)
    .max(50)
    .optional(),
});

const PreviewQuestionsValidation = Joi.object({
  // AI preview only
  numOfQuestions: numberValidator("No of Questions", 1, 5, true),
  language: selectValidator("Test language", TEST_LANGUAGES, true),
  level: selectValidator("Test Level", TEST_LEVELS, true),
});

const editQuestionSchema = Joi.object({
  _id: Joi.any().optional(),
  questionText: Joi.string().required().messages({
    "any.required": "Question is required",
    "string.empty": "Question is required",
  }),
  sampleInput: Joi.string().allow("").optional(),
  expectedOutput: Joi.string().required().messages({
    "any.required": "Expected output is required",
    "string.empty": "Expected output is required",
  }),
});

// Full edit: details + questions (numOfQuestions derived on server)
const EditTestValidation = Joi.object({
  name: stringValidator("Test Name", 3, 100, true),
  language: selectValidator("Test language", TEST_LANGUAGES, true),
  level: selectValidator("Test Level", TEST_LEVELS, true),
  questions: Joi.array()
    .items(editQuestionSchema)
    .min(1)
    .max(50)
    .required()
    .messages({
      "any.required": "Questions are required",
      "array.min": "At least one question is required",
      "array.max": "You can have at most 50 questions",
    }),
});

export { TestValidation, PreviewQuestionsValidation, EditTestValidation };
