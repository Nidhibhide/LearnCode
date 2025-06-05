"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateValidation = exports.EmailValidation = exports.LoginValidation = exports.userRegisterValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const GlobalValidation_1 = require("../utils/GlobalValidation");
const userRegisterValidation = joi_1.default.object({
    name: (0, GlobalValidation_1.stringValidator)("Name", 3, 50, true),
    email: (0, GlobalValidation_1.emailValidator)(),
    password: (0, GlobalValidation_1.passwordValidator)(),
    role: (0, GlobalValidation_1.selectValidator)("Role", ["user", "admin"]),
});
exports.userRegisterValidation = userRegisterValidation;
const LoginValidation = joi_1.default.object({
    email: (0, GlobalValidation_1.emailValidator)(),
    password: (0, GlobalValidation_1.passwordValidator)(),
});
exports.LoginValidation = LoginValidation;
const EmailValidation = joi_1.default.object({
    email: (0, GlobalValidation_1.emailValidator)(),
});
exports.EmailValidation = EmailValidation;
const userUpdateValidation = joi_1.default.object({
    name: (0, GlobalValidation_1.stringValidator)("Name", 3, 50, true),
    email: (0, GlobalValidation_1.emailValidator)(),
});
exports.userUpdateValidation = userUpdateValidation;
//# sourceMappingURL=user.js.map