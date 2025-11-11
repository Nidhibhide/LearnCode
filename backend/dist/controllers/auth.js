"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.verifyCurrentPassword = exports.checkToken = exports.resetPass = exports.forgotPass = exports.changePassword = exports.resendVerificationEmail = exports.verifyUser = void 0;
const models_1 = require("../models");
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const utils_1 = require("../utils");
const resendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield (0, utils_1.findUserByEmail)(email);
        if (!user) {
            return (0, utils_1.JsonOne)(res, 404, "User not found", false);
        }
        if (user.isVerified) {
            return (0, utils_1.JsonOne)(res, 400, "User already verified", false);
        }
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const newExpireTime = (0, utils_1.expireTime)();
        user.verificationToken = token;
        user.expireTime = newExpireTime;
        yield user.save();
        yield nodemailer_1.default.createTestAccount();
        const transporter = (0, utils_1.transporterFun)();
        yield transporter.sendMail((0, utils_1.mailOptionsForVerify)(email, token));
        return (0, utils_1.JsonOne)(res, 200, `Verification email has been resent to ${email}`, true);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "Error while resending verification email");
    }
});
exports.resendVerificationEmail = resendVerificationEmail;
const verifyCurrentPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = req.body;
        const user = yield (0, utils_1.findUserByEmail)(email);
        if (!user) {
            return (0, utils_1.JsonOne)(res, 404, "User not found", false);
        }
        if (!user.password) {
            return (0, utils_1.JsonOne)(res, 404, "User stored password not found", false);
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return (0, utils_1.JsonOne)(res, 401, "Incorrect password", false);
        }
        return (0, utils_1.JsonOne)(res, 200, "Password Match Found", true);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while verify current password");
    }
});
exports.verifyCurrentPassword = verifyCurrentPassword;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        if (!token) {
            return (0, utils_1.JsonOne)(res, 401, "Token not provided!!", false);
        }
        const user = yield models_1.User.findOne({ verificationToken: token });
        if (user === null || user === void 0 ? void 0 : user.isVerified) {
            return (0, utils_1.JsonOne)(res, 400, "User already verified!!", true);
        }
        if (!(user === null || user === void 0 ? void 0 : user.expireTime) || new Date() > user.expireTime) {
            return (0, utils_1.JsonOne)(res, 400, "Verification link expired!!", false);
        }
        user.isVerified = true;
        yield user.save();
        return (0, utils_1.JsonOne)(res, 200, "Verification Done!!", true);
    }
    catch (error) {
        return (0, utils_1.JsonOne)(res, 500, "Verification Failed", false);
    }
});
exports.verifyUser = verifyUser;
const forgotPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield (0, utils_1.findUserByEmail)(email);
        if (!user) {
            return (0, utils_1.JsonOne)(res, 404, "User not found", false);
        }
        const token = crypto_1.default.randomBytes(12).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpire = (0, utils_1.expireTime)();
        yield user.save();
        yield nodemailer_1.default.createTestAccount();
        const transporter = (0, utils_1.transporterFun)();
        const mailOptions = (0, utils_1.mailOptionsForVResetPass)(email, token);
        yield transporter.sendMail(mailOptions);
        return (0, utils_1.JsonOne)(res, 200, `Verification link sent to ${email}  Click it to reset your password.`, true);
    }
    catch (error) {
        console.error("Forgot Password Error:", error);
        return (0, utils_1.handleError)(res, "Something went wrong. Please try again later.");
    }
});
exports.forgotPass = forgotPass;
const resetPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        if (!token) {
            return (0, utils_1.JsonOne)(res, 401, "Token not provided!!", false);
        }
        const user = yield models_1.User.findOne({ resetPasswordToken: token }, { resetPasswordExpire: 1, email: 1 });
        if (!user || !user.resetPasswordExpire) {
            return (0, utils_1.JsonOne)(res, 404, "User not found!!", false);
        }
        const currentTime = new Date();
        if (currentTime > user.resetPasswordExpire) {
            return (0, utils_1.JsonOne)(res, 400, "Verification link expired!!", false);
        }
        return (0, utils_1.JsonOne)(res, 200, "success!!", true, user);
    }
    catch (error) {
        return (0, utils_1.JsonOne)(res, 500, "reset password Failed", false);
    }
});
exports.resetPass = resetPass;
const checkToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.access_token;
    if (!token) {
        return (0, utils_1.JsonOne)(res, 404, "Token not found", false);
    }
    const decoded = (0, utils_1.verifyToken)(token, process.env.ACCESS_TOKEN);
    if (!decoded) {
        return (0, utils_1.JsonOne)(res, 500, "Token expired or invalid", false);
    }
    return (0, utils_1.JsonOne)(res, 200, "Token valid", true);
});
exports.checkToken = checkToken;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refresh_token;
    if (!token) {
        return (0, utils_1.JsonOne)(res, 404, "Token not found", false);
    }
    const decoded = (0, utils_1.verifyToken)(token, process.env.REFRESH_TOKEN);
    if (!decoded) {
        return (0, utils_1.JsonOne)(res, 500, "Refresh Token expired or invalid", false);
    }
    const jwtToken = jsonwebtoken_1.default.sign({ id: decoded.id }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
    res.cookie("access_token", jwtToken, utils_1.accessTokenOptions);
    return (0, utils_1.JsonOne)(res, 200, "Token refreshed successfully", true);
});
exports.refreshToken = refreshToken;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield (0, utils_1.findUserByEmail)(email);
        if (!user) {
            return (0, utils_1.JsonOne)(res, 404, "User not found", false);
        }
        const hashedPass = yield bcryptjs_1.default.hash(password, 10);
        user.password = hashedPass;
        yield user.save();
        return (0, utils_1.JsonOne)(res, 200, "Password reset successfully", true);
    }
    catch (error) {
        console.error("Error resetting password:", error);
        return (0, utils_1.handleError)(res, "Server error");
    }
});
exports.changePassword = changePassword;
//# sourceMappingURL=auth.js.map