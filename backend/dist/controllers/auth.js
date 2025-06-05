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
exports.verifyCurrentPassword = exports.checkToken = exports.resetPass = exports.forgotPass = exports.changePassword = exports.resendVerificationEmail = exports.verifyUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const responseFun_1 = require("../utils/responseFun");
const expireTimeFun_1 = __importDefault(require("../utils/expireTimeFun"));
const sendEmailFun_1 = require("../utils/sendEmailFun");
const expireTimeFun_2 = __importDefault(require("../utils/expireTimeFun"));
const resendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return (0, responseFun_1.JsonOne)(res, 404, "User not found", false);
        }
        // Optional: Check if already verified
        if (user.isVerified === true) {
            return (0, responseFun_1.JsonOne)(res, 400, "User already verified", false);
        }
        // Generate new verification token
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const newExpireTime = (0, expireTimeFun_1.default)();
        user.verificationToken = token;
        user.expireTime = newExpireTime;
        yield user.save();
        yield nodemailer_1.default.createTestAccount();
        const transporter = (0, sendEmailFun_1.transporterFun)();
        yield transporter.sendMail((0, sendEmailFun_1.mailOptionsForVerify)(email, token));
        return (0, responseFun_1.JsonOne)(res, 200, `Verification email has been resent to ${email}`, true);
    }
    catch (error) {
        return (0, responseFun_1.JsonOne)(res, 500, "Error while resending verification email", false);
    }
});
exports.resendVerificationEmail = resendVerificationEmail;
const verifyCurrentPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return (0, responseFun_1.JsonOne)(res, 404, "User not found", false);
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return (0, responseFun_1.JsonOne)(res, 401, "Incorrect password", false);
        }
        return (0, responseFun_1.JsonOne)(res, 200, "Password Match Found", true);
    }
    catch (error) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while verify current password", false);
    }
});
exports.verifyCurrentPassword = verifyCurrentPassword;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const successURL = process.env.VERIFY_SUCCESS_URL;
        const failURL = process.env.VERIFY_FAILURE_URL;
        const { token } = req.params;
        if (!token) {
            return res.redirect(`${failURL}?status=fail&message=Token not provided!!`);
        }
        const user = yield user_1.default.findOne({ verificationToken: token });
        if (user === null || user === void 0 ? void 0 : user.isVerified) {
            return res.redirect(`${successURL}?status=success&message=User already verified!!`);
        }
        if (!(user === null || user === void 0 ? void 0 : user.expireTime) || new Date() > user.expireTime) {
            return res.redirect(`${failURL}?status=fail&message=Verification link expired!!`);
        }
        // Mark user as verified
        user.isVerified = true;
        // user.verificationToken = undefined;
        yield user.save();
        return res.redirect(`${successURL}?status=success&message=Verification Done!!`);
    }
    catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
    }
});
exports.verifyUser = verifyUser;
const forgotPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return (0, responseFun_1.JsonOne)(res, 400, "User not found", false);
        }
        const token = crypto_1.default.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpire = (0, expireTimeFun_2.default)();
        yield user.save();
        yield nodemailer_1.default.createTestAccount();
        const transporter = (0, sendEmailFun_1.transporterFun)();
        const mailOptions = (0, sendEmailFun_1.mailOptionsForVResetPass)(email, token);
        yield transporter.sendMail(mailOptions);
        return (0, responseFun_1.JsonOne)(res, 200, `Verification link sent to ${email}  Click it to reset your password.`, true);
    }
    catch (error) {
        console.error("Forgot Password Error:", error);
        return (0, responseFun_1.JsonOne)(res, 500, "Something went wrong. Please try again later.", false);
    }
});
exports.forgotPass = forgotPass;
const resetPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const RESET_URL = process.env.RESET_URL;
    // const { newPass } = req.body;
    if (!token) {
        return res.redirect(`${RESET_URL}?status=fail&message=Token not provided!!`);
    }
    const user = yield user_1.default.findOne({
        resetPasswordToken: token,
    });
    if (!user || !user.resetPasswordExpire) {
        return res.redirect(`${RESET_URL}?status=fail&message=User not found!!`);
    }
    const expireTime = user === null || user === void 0 ? void 0 : user.resetPasswordExpire;
    const currentTime = new Date();
    if (currentTime > expireTime) {
        return res.redirect(`${RESET_URL}?status=fail&message=Reset link expired!!`);
    }
    return res.redirect(`${RESET_URL}?status=success&email=${user === null || user === void 0 ? void 0 : user.email}`);
});
exports.resetPass = resetPass;
const checkToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        return (0, responseFun_1.JsonOne)(res, 401, "Token not found", false);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        return (0, responseFun_1.JsonOne)(res, 200, "Token valid", true);
    }
    catch (err) {
        return (0, responseFun_1.JsonOne)(res, 500, "Token expired or invalid", false);
    }
});
exports.checkToken = checkToken;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return (0, responseFun_1.JsonOne)(res, 404, "User not found", false);
        }
        const hashedPass = yield bcryptjs_1.default.hash(password, 10);
        user.password = hashedPass;
        yield user.save();
        return (0, responseFun_1.JsonOne)(res, 200, "Password reset successfully", true);
    }
    catch (error) {
        console.error("Error resetting password:", error);
        return (0, responseFun_1.JsonOne)(res, 500, "Server error", false);
    }
});
exports.changePassword = changePassword;
//# sourceMappingURL=auth.js.map