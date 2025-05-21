import Joi from "joi";
import {
  numberValidator,
  selectValidator,
  stringValidator,
} from "../utils/GlobalValidation";

const TestValidation = Joi.object({
  name: stringValidator("Test Name", 3, 100, true),

  numOfQuestions: numberValidator("No of Questions", 1, 5, true),

  language: selectValidator(
    "Test language",
    ["Java", "C++", "JavaScript", "Python", "C"],
    true
  ),

  level: selectValidator(
    "Test Level",
    ["Basic", "Intermediate", "Advanced"],
    true
  ),
});

export { TestValidation };
