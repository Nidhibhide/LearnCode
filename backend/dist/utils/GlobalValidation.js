"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberValidator = exports.selectValidator = exports.passwordValidator = exports.emailValidator = exports.stringValidator = void 0;
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
// 3. Password Validator (digits only)
const passwordValidator = (label = "Password", min = 5, max = 10, required = false) => {
    let rule = joi_1.default.string()
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
exports.passwordValidator = passwordValidator;
// 4. Select Validator
const selectValidator = (label, options = [""], required = true) => {
    let rule = joi_1.default.string()
        .valid(...options)
        .messages({
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
//# sourceMappingURL=GlobalValidation.js.map