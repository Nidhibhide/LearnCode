import Joi from "joi";

const userRegisterValidation = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z\s]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "Only alphabets and spaces are allowed",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name should not exceed 50 characters",
      "any.required": "Name is required",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Email format is invalid",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(5).max(10).pattern(/^\d+$/).required().messages({
    "string.min": "Password must be at least 5 characters",
    "string.max": "Password should not exceed 10 characters",
    "string.pattern.base": "Password must contain digits only",
    "any.required": "Password is required",
  }),
});

const LoginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(5).max(10).pattern(/^\d+$/).required().messages({
    "string.min": "Password must be at least 5 characters",
    "string.max": "Password should not exceed 10 characters",
    "string.pattern.base": "Password must contain digits only",
    "any.required": "Password is required",
  }),
});

export { userRegisterValidation, LoginValidation };
