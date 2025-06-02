import Joi, { string } from "joi";

// 1. String Validator
export const stringValidator = (
  label: string,
  min: number,
  max: number,
  required = false
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

// 3. Password Validator (digits only)
export const passwordValidator = (
  label = "Password",
  min = 5,
  max = 10,
  required = false
) => {
  let rule = Joi.string()
    .pattern(/^\d+$/)
    .min(min)
    .max(max)
    .messages({
      "string.pattern.base": `${label} must contain digits only`,
      "string.min": `${label} must be at least ${min} digits`,
      "string.max": `${label} must not exceed ${max} digits`,
    });

  return required
    ? rule.required().messages({ "any.required": `${label} is required` })
    : rule;
};

// 4. Select Validator
export const selectValidator = (
  label: string,
  options = [""],
  required = true
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
  required = false
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
