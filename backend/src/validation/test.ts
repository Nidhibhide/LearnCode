import Joi from "joi";
import {
  numberValidator,
  selectValidator,
  stringValidator,
} from "../utils/GlobalValidation";

const TEST_LANGUAGES = ["Java", "C++", "JavaScript", "Python", "C"];
const TEST_LEVELS = ["Basic", "Intermediate", "Advanced"];

const TestValidation = Joi.object({
  name: stringValidator("Test Name", 3, 100, true),

  numOfQuestions: numberValidator("No of Questions", 1, 5, true),

  language: selectValidator("Test language", TEST_LANGUAGES, true),

  level: selectValidator("Test Level", TEST_LEVELS, true),
});

export { TestValidation };
