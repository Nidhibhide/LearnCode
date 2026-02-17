import Joi from "joi";

// 1. String Validator
export const stringValidator = (
  label: string,
  min: number,
  max: number,
  required = false,
) => {
  let rule = Joi.string()
    .pattern(/^[a-zA-Z\s]+$/)
    .min(min)
    .max(max)
    .messages({
      "string.pattern.base": `${label} should contain only letters and spaces`,
      "string.min": `${label} must be at least ${min} characters`,
      "string.max": `${label} must not exceed ${max} characters`,
    });

  return required
    ? rule.required().messages({ "any.required": `${label} is required` })
    : rule;
};

// 2. Email Validator
export const emailValidator = (label = "Email", required = true) => {
  let rule = Joi.string()
    .email()
    .messages({
      "string.email": `${label} is not valid`,
    });

  return required
    ? rule.required().messages({ "any.required": `${label} is required` })
    : rule;
};

// 3. Password Validator (Strong password validation)
// Rules: 8-12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char, no spaces
export const passwordValidator = (
  label = "Password",
  min = 8,
  max = 12,
  required = false,
) => {
  let rule = Joi.string()
    .min(min)
    .max(max)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])\S+$/,
    )
    .messages({
      "string.min": `${label} must be at least ${min} characters`,
      "string.max": `${label} must not exceed ${max} characters`,
      "string.pattern.base": `${label} must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and no spaces`,
    });

  if (required) {
    rule = rule.required().messages({ "any.required": `${label} is required` });
  }

  return rule;
};

// 4. Select Validator
export const selectValidator = (
  label: string,
  options = [""],
  required = true,
) => {
  let rule = Joi.string()
    .valid(...options)
    .messages({
      "any.only": `${label} must be one of: ${options.join(", ")}`,
    });

  return required
    ? rule.required().messages({ "any.required": `${label} is required` })
    : rule;
};

// 5. Number Validator
export const numberValidator = (
  label: string,
  min: number,
  max: number,
  required = false,
) => {
  let rule = Joi.number()
    .min(min)
    .max(max)
    .messages({
      "number.base": `${label} must be a number`,
      "number.min": `${label} must be at least ${min}`,
      "number.max": `${label} must not exceed ${max}`,
    });

  return required
    ? rule.required().messages({ "any.required": `${label} is required` })
    : rule;
};
