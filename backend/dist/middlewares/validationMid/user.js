"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateMid = exports.EmailValidtorMid = exports.LoginValidtorMid = exports.userRegisterMid = void 0;
const user_1 = require("../../validation/user");
const responseFun_1 = require("../../utils/responseFun");
const userRegisterMid = (req, res, next) => {
    const { error } = user_1.userRegisterValidation.validate(req.body);
    if (error) {
        const message = error.details[0].message;
        return (0, responseFun_1.JsonOne)(res, 400, message, false);
    }
    next();
};
exports.userRegisterMid = userRegisterMid;
const userUpdateMid = (req, res, next) => {
    const { error } = user_1.userUpdateValidation.validate(req.body);
    if (error) {
        const message = error.details[0].message;
        return (0, responseFun_1.JsonOne)(res, 400, message, false);
    }
    next();
};
exports.userUpdateMid = userUpdateMid;
const LoginValidtorMid = (req, res, next) => {
    const { error } = user_1.LoginValidation.validate(req.body);
    if (error) {
        const message = error.details[0].message;
        return (0, responseFun_1.JsonOne)(res, 400, message, false);
    }
    next();
};
exports.LoginValidtorMid = LoginValidtorMid;
const EmailValidtorMid = (req, res, next) => {
    const { error } = user_1.EmailValidation.validate(req.body);
    if (error) {
        const message = error.details[0].message;
        return (0, responseFun_1.JsonOne)(res, 400, message, false);
    }
    next();
};
exports.EmailValidtorMid = EmailValidtorMid;
//# sourceMappingURL=user.js.map