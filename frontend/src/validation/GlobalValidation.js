import * as Yup from "yup";

/**
 * Global Validation Utilities for Frontend
 * These validators are designed to work with Formik and Yup
 * Mirrors the backend's GlobalValidation.ts
 */

// 1. String Validator
// Validates string with optional pattern, min/max length
export const stringValidator = (
  label,
  min,
  max,
  required = false
) => {
  let validator = Yup.string();

  if (min !== undefined) {
    validator = validator.min(min, `${label} must be at least ${min} characters`);
  }
  
  if (max !== undefined) {
    validator = validator.max(max, `${label} must not exceed ${max} characters`);
  }

  if (required) {
    validator = validator.required(`${label} is required`);
  }

  return validator;
};

// 2. Alphabet String Validator
// Validates string contains only letters and spaces (like backend stringValidator)
export const alphabetStringValidator = (
  label,
  min,
  max,
  required = false
) => {
  let validator = Yup.string()
    .matches(/^[a-zA-Z\s]+$/, `${label} should contain only letters and spaces`);

  if (min !== undefined) {
    validator = validator.min(min, `${label} must be at least ${min} characters`);
  }
  
  if (max !== undefined) {
    validator = validator.max(max, `${label} must not exceed ${max} characters`);
  }

  if (required) {
    validator = validator.required(`${label} is required`);
  }

  return validator;
};

// 3. Email Validator
export const emailValidator = (label = "Email", required = true) => {
  let validator = Yup.string()
    .email(`${label} is not valid`);

  if (required) {
    validator = validator.required(`${label} is required`);
  }

  return validator;
};

// 4. Password Validator (Strong - matches ToolTip.jsx rules)
// Rules: 8-12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char, no spaces
export const passwordValidator = (
  label = "Password",
  min = 8,
  max = 12,
  required = false
) => {
  let validator = Yup.string()
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} must not exceed ${max} characters`)
    .matches(/[A-Z]/, `${label} must contain at least 1 uppercase letter`)
    .matches(/[a-z]/, `${label} must contain at least 1 lowercase letter`)
    .matches(/[0-9]/, `${label} must contain at least 1 number`)
    .matches(/[!@#$%^&*(),.?":{}|<>]/, `${label} must contain at least 1 special character`)
    .matches(/^\S*$/, `${label} must not contain spaces`);

  if (required) {
    validator = validator.required(`${label} is required`);
  }

  return validator;
};

// 5. Select/Enum Validator
// Validates that the value is one of the allowed options
export const selectValidator = (
  label,
  options = [""],
  required = true
) => {
  let validator = Yup.string()
    .oneOf(options, `${label} must be one of: ${options.join(", ")}`);

  if (required) {
    validator = validator.required(`${label} is required`);
  }

  return validator;
};

// 6. Number Validator
export const numberValidator = (
  label,
  min,
  max,
  required = false
) => {
  let validator = Yup.number()
    .typeError(`${label} must be a number`);

  if (min !== undefined) {
    validator = validator.min(min, `${label} must be at least ${min}`);
  }
  
  if (max !== undefined) {
    validator = validator.max(max, `${label} must not exceed ${max}`);
  }

  if (required) {
    validator = validator.required(`${label} is required`);
  }

  return validator;
};

// 7. Integer Validator
export const integerValidator = (
  label,
  min,
  max,
  required = false
) => {
  let validator = Yup.number()
    .integer(`${label} must be an integer`)
    .typeError(`${label} must be a number`);

  if (min !== undefined) {
    validator = validator.min(min, `${label} must be at least ${min}`);
  }
  
  if (max !== undefined) {
    validator = validator.max(max, `${label} must not exceed ${max}`);
  }

  if (required) {
    validator = validator.required(`${label} is required`);
  }

  return validator;
};

// 8. URL Validator
export const urlValidator = (label = "URL", required = false) => {
  let validator = Yup.string()
    .url(`${label} must be a valid URL`);

  if (required) {
    validator = validator.required(`${label} is required`);
  }

  return validator;
};

// 9. Date Validator
export const dateValidator = (label = "Date", required = false) => {
  let validator = Yup.date()
    .typeError(`${label} must be a valid date`);

  if (required) {
    validator = validator.required(`${label} is required`);
  }

  return validator;
};

// 10. Boolean Validator
export const booleanValidator = (label = "Field", required = false) => {
  let validator = Yup.boolean();

  if (required) {
    validator = validator.required(`${label} is required`);
  }

  return validator;
};

// 11. Array Validator
export const arrayValidator = (label = "Field", required = false) => {
  let validator = Yup.array();

  if (required) {
    validator = validator.required(`${label} is required`);
  }

  return validator;
};

// 12. Match Validator (for confirm password, etc.)
export const matchValidator = (
  label,
  refField,
  refLabel = "Field",
  required = false
) => {
  let validator = Yup.string()
    .oneOf([Yup.ref(refField)], `${label} must match ${refLabel}`);

  if (required) {
    validator = validator.required(`${label} is required`);
  }

  return validator;
};

// 13. Required Validator (basic required check)
export const requiredValidator = (label) => {
  return Yup.string().required(`${label} is required`);
};

// 14. Optional Validator (makes field optional)
export const optionalValidator = (validator) => {
  return validator.notRequired();
};
