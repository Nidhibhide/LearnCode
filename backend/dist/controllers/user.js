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
exports.updateProfile = exports.logOut = exports.getMe = exports.login = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const responseFun_1 = require("../utils/responseFun");
const expireTimeFun_1 = __importDefault(require("../utils/expireTimeFun"));
const sendEmailFun_1 = require("../utils/sendEmailFun");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return (0, responseFun_1.JsonOne)(res, 409, "User already exists ", false);
        }
        const user = yield user_1.default.create({
            name,
            email,
            password,
            role,
        });
        if (!user) {
            return (0, responseFun_1.JsonOne)(res, 500, "Failed to create user", false);
        }
        const hashedPass = yield bcryptjs_1.default.hash(password, 10);
        user.password = hashedPass;
        const time = (0, expireTimeFun_1.default)();
        user.expireTime = time;
        const token = crypto_1.default.randomBytes(32).toString("hex");
        user.verificationToken = token;
        yield user.save();
        yield nodemailer_1.default.createTestAccount();
        const transporter = (0, sendEmailFun_1.transporterFun)();
        yield transporter.sendMail((0, sendEmailFun_1.mailOptionsForVerify)(email, token));
        (0, responseFun_1.JsonOne)(res, 201, `User registered successfully. Verification email has been sent to ${email}  `, true);
    }
    catch (error) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while sign up", false);
    }
});
exports.registerUser = registerUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return (0, responseFun_1.JsonOne)(res, 404, "User not found", false);
        }
        if (!user.isVerified) {
            return (0, responseFun_1.JsonOne)(res, 403, "User is not verified", false);
        }
        //compare password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return (0, responseFun_1.JsonOne)(res, 401, "Incorrect password", false);
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h",
        });
        //set token in cookie
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 1000,
        };
        //     const cookieOptions = {
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: "None",
        //   maxAge: 60 * 60 * 1000,
        // }; this i can use for mobile & laptop both in secure way
        res.cookie("token", token, cookieOptions);
        return (0, responseFun_1.JsonOne)(res, 200, "Login successful", true);
    }
    catch (error) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while sign in", false);
    }
});
exports.login = login;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return (0, responseFun_1.JsonOne)(res, 400, "Profile not found", false);
        }
        return (0, responseFun_1.JsonOne)(res, 200, "User Found", true, user);
    }
    catch (error) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while fetching user", false);
    }
});
exports.getMe = getMe;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        res.cookie("token", "", {});
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        return (0, responseFun_1.JsonOne)(res, 200, "Logout successfully", true);
    }
    catch (error) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while logging out ", false);
    }
});
exports.logOut = logOut;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email } = req.body;
        const updatedUser = yield user_1.default.findOneAndUpdate({ email: email }, { name, email }, { new: true }).select("createdAt email isVerified name role _id");
        if (!updatedUser) {
            return (0, responseFun_1.JsonOne)(res, 404, "User not found", false);
        }
        (0, responseFun_1.JsonOne)(res, 201, "Profile updated successfully", true, updatedUser);
    }
    catch (err) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while updating user", false);
    }
});
exports.updateProfile = updateProfile;
//# sourceMappingURL=user.js.map