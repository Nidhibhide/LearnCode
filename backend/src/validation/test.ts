import Joi from "joi";

const createTestValidation = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Test name must be a string",
    "string.min": "Test name must be at least 3 characters",
    "string.max": "Test name should not exceed 100 characters",
    "any.required": "Test name is required",
  }),

  numOfQuestions: Joi.number().integer().min(1).max(100).required().messages({
    "number.base": "Number of questions must be a number",
    "number.min": "There must be at least 1 question",
    "number.max": "Questions should not exceed 100",
    "any.required": "Number of questions is required",
  }),

  language: Joi.string()
    .valid("Java", "C++", "JavaScript", "Python", "C")
    .required()
    .messages({
      "any.only":
        "Language must be one of Java, React JS, JavaScript, Python, or C",
      "any.required": "Language is required",
    }),

  level: Joi.string()
    .valid("Basic", "Intermediate", "Advanced")
    .required()
    .messages({
      "any.only": "Level must be one of Basic, Intermediate, or Advanced",
      "any.required": "Level is required",
    }),
});

export { createTestValidation };
