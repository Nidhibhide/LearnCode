"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateValidator = exports.numberValidator = exports.selectValidator = exports.passwordValidator = exports.emailValidator = exports.stringValidator = void 0;
const joi_1 = __importDefault(require("joi"));
// 1. String Validator
const stringValidator = (label, min, max, required = false) => {
    let rule = joi_1.default.string()
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
exports.stringValidator = stringValidator;
// 2. Email Validator
const emailValidator = (label = "Email", required = true) => {
    let rule = joi_1.default.string()
        .email()
        .messages({
        "string.email": `${label} is not valid`,
    });
    return required
        ? rule.required().messages({ "any.required": `${label} is required` })
        : rule;
};
exports.emailValidator = emailValidator;
// 3. Password Validator (Strong password validation)
// Rules: 8-12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char, no spaces
const passwordValidator = (label = "Password", min = 8, max = 12, required = false) => {
    let rule = joi_1.default.string()
        .min(min)
        .max(max)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])\S+$/)
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
exports.passwordValidator = passwordValidator;
// 4. Select Validator
const selectValidator = (label, options = [""], required = true, defaultValue) => {
    let rule = joi_1.default.string()
        .valid(...options);
    // Only set default if provided
    if (defaultValue) {
        rule = rule.default(defaultValue);
    }
    rule = rule.messages({
        "any.only": `${label} must be one of: ${options.join(", ")}`,
    });
    return required
        ? rule.required().messages({ "any.required": `${label} is required` })
        : rule;
};
exports.selectValidator = selectValidator;
// 5. Number Validator
const numberValidator = (label, min, max, required = false) => {
    let rule = joi_1.default.number()
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
exports.numberValidator = numberValidator;
// 6. Date Validator (yyyy-mm-dd format)
const dateValidator = (label, required = false) => {
    let rule = joi_1.default.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .messages({
        "string.pattern.base": `${label} must be in yyyy-mm-dd format`,
    });
    return required
        ? rule.required().messages({ "any.required": `${label} is required` })
        : rule;
};
exports.dateValidator = dateValidator;
//# sourceMappingURL=GlobalValidation.js.map