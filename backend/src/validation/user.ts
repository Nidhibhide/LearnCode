import Joi from "joi";
import {
  stringValidator,
  emailValidator,
  passwordValidator,
  selectValidator,
  dateValidator,
} from "../utils/GlobalValidation";

const userRegisterValidation = Joi.object({
  name: stringValidator("Name", 3, 50, true),

  email: emailValidator(),

  password: passwordValidator(),

  role: selectValidator("Role", ["student", "admin"], false, "student"),
});

const LoginValidation = Joi.object({
  email: emailValidator(),
  password: passwordValidator(),
  role: selectValidator("Role", ["student", "admin"], false),
});

const EmailValidation = Joi.object({
  email: emailValidator(),
});

const userUpdateValidation = Joi.object({
  name: stringValidator("Name", 3, 50, true),
  email: emailValidator(),
  dob: dateValidator("Date of Birth", false),
});

// const ResetPassValidation = Joi.object({
//   password: Joi.string().min(5).max(10).pattern(/^\d+$/).required().messages({
//     "string.min": "Password must be at least 5 characters",
//     "string.max": "Password should not exceed 10 characters",
//     "string.pattern.base": "Password must contain digits only",
//     "any.required": "Password is required",
//   }),
// });

export {
  userRegisterValidation,
  LoginValidation,
  EmailValidation,
  // ResetPassValidation,
  userUpdateValidation,
};
