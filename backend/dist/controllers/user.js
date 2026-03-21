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
exports.verifyEmailChange = exports.googleLogin = exports.updateProfile = exports.logOut = exports.getMe = exports.login = exports.registerUser = void 0;
const models_1 = require("../models");
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const google_auth_library_1 = require("google-auth-library");
const crypto_1 = __importDefault(require("crypto"));
const utils_1 = require("../utils");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = yield (0, utils_1.findUserByEmail)(email);
        if (existingUser) {
            return (0, utils_1.JsonOne)(res, 409, "User already exists ", false);
        }
        // Check if password is already used by someone else with the same role
        const passwordInUse = yield (0, utils_1.isPasswordUsedByOtherUser)(password, role);
        if (passwordInUse) {
            return (0, utils_1.JsonOne)(res, 400, "This password is already in use by another user. Please choose a different password.", false);
        }
        const hashedPass = yield bcryptjs_1.default.hash(password, 10);
        const time = (0, utils_1.expireTime)();
        const token = crypto_1.default.randomBytes(12).toString("hex");
        const user = yield models_1.User.create({
            name,
            email,
            password: hashedPass,
            expireTime: time,
            verificationToken: token,
            role: role || "student",
        });
        if (!user) {
            return (0, utils_1.JsonOne)(res, 500, "Failed to create user", false);
        }
        yield (0, utils_1.sendWelcomeMessage)(user._id.toString(), name);
        // Only notify admin if the new user is NOT an admin
        if (role !== "admin") {
            yield (0, utils_1.notifyAdminOfNewUser)(name);
        }
        yield nodemailer_1.default.createTestAccount();
        const transporter = (0, utils_1.transporterFun)();
        yield transporter.sendMail((0, utils_1.mailOptionsForVerify)(email, token));
        (0, utils_1.JsonOne)(res, 201, `User registered successfully. Verification email has been sent to ${email}  `, true);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while sign up");
    }
});
exports.registerUser = registerUser;
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { token } = req.body;
    try {
        if (!token) {
            return (0, utils_1.JsonOne)(res, 404, "Google token not found", false);
        }
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload)
            return (0, utils_1.JsonOne)(res, 401, "Invalid Google token", false);
        const { email, name, sub } = payload;
        if (!email || !name || !sub) {
            return (0, utils_1.JsonOne)(res, 400, "Incomplete Google user data", false);
        }
        let user = yield (0, utils_1.findUserByEmail)(email);
        // If user exists but with different auth provider, return error
        if (user && user.authProvider && user.authProvider !== "google") {
            const providerName = user.authProvider === "local" ? "Credential login" : "sign in with Google";
            return (0, utils_1.JsonOne)(res, 400, `This email is already registered with ${providerName}. Please use your that method.`, false);
        }
        // If user doesn't exist, create a new one
        if (!user) {
            const hashedPass = yield bcryptjs_1.default.hash(sub, 10);
            user = yield models_1.User.create({
                name,
                email,
                password: hashedPass,
                isVerified: true,
                role: "student",
                authProvider: "google",
            });
        }
        // Check if user is verified
        if (!user.isVerified) {
            return (0, utils_1.JsonOne)(res, 400, "User is not verified", false);
        }
        // Check if user is blocked (same as login)
        if (user.isBlocked) {
            return (0, utils_1.JsonOne)(res, 403, "Account is blocked due to multiple failed login attempts. Please reset your password.", false);
        }
        // Reset failed attempts and update last login (same as login)
        user.failedAttempts = 0;
        user.lastLogin = new Date();
        yield user.save();
        // Check and notify if DOB is missing
        yield (0, utils_1.notifyDobMissing)(user._id.toString());
        // Check and notify if birthday is upcoming
        yield (0, utils_1.notifyUpcomingBirthday)(user._id.toString());
        const access_token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
        res.cookie("access_token", access_token, utils_1.accessTokenOptions);
        const refresh_token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
        res.cookie("refresh_token", refresh_token, utils_1.refreshTokenOptions);
        return (0, utils_1.JsonOne)(res, 200, "Login successful", true);
    }
    catch (err) {
        console.error("Google login failed:", err.message || err);
        return (0, utils_1.JsonOne)(res, 500, "Google login failed", false);
    }
});
exports.googleLogin = googleLogin;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email, role } = req.body;
        const user = yield (0, utils_1.findUserByEmail)(email);
        if (!user || !user.password) {
            return (0, utils_1.JsonOne)(res, 404, "User or password not found", false);
        }
        if (!user.isVerified) {
            return (0, utils_1.JsonOne)(res, 400, "User is not verified", false);
        }
        if (user.isBlocked) {
            return (0, utils_1.JsonOne)(res, 403, "Account is blocked due to multiple failed login attempts. Please reset your password.", false);
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            user.failedAttempts += 1;
            if (user.failedAttempts >= parseInt(process.env.MAX_FAILED_ATTEMPTS || "3")) {
                user.isBlocked = true;
            }
            yield user.save();
            return (0, utils_1.JsonOne)(res, 401, "Incorrect password", false);
        }
        // Successful login
        user.failedAttempts = 0;
        user.lastLogin = new Date();
        yield user.save();
        // Check and notify if DOB is missing
        yield (0, utils_1.notifyDobMissing)(user._id.toString());
        // Check and notify if birthday is upcoming
        yield (0, utils_1.notifyUpcomingBirthday)(user._id.toString());
        const access_token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
        res.cookie("access_token", access_token, utils_1.accessTokenOptions);
        const refresh_token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
        res.cookie("refresh_token", refresh_token, utils_1.refreshTokenOptions);
        return (0, utils_1.JsonOne)(res, 200, "Login successful", true);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while sign in");
    }
});
exports.login = login;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return (0, utils_1.JsonOne)(res, 404, "Profile not found", false);
        }
        return (0, utils_1.JsonOne)(res, 200, "User Found", true, user);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while fetching user");
    }
});
exports.getMe = getMe;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("access_token", utils_1.clearCookies);
        res.clearCookie("refresh_token", utils_1.clearCookies);
        return (0, utils_1.JsonOne)(res, 200, "Logout successfully", true);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while logging out");
    }
});
exports.logOut = logOut;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, dob } = req.body;
        const { id } = req.params;
        const user = yield models_1.User.findById(id);
        if (!user) {
            return (0, utils_1.JsonOne)(res, 404, "User not found", false);
        }
        if ((user === null || user === void 0 ? void 0 : user.authProvider) === "google" && email !== (user === null || user === void 0 ? void 0 : user.email)) {
            return (0, utils_1.JsonOne)(res, 400, "Cannot update email for Google-authenticated users", false);
        }
        // If email is being changed, send verification email
        if (email && email !== user.email) {
            const existingUser = yield (0, utils_1.findUserByEmail)(email);
            if (existingUser) {
                return (0, utils_1.JsonOne)(res, 400, "Email already in use", false);
            }
            // Create token with user ID and new email
            const token = jsonwebtoken_1.default.sign({ id: user._id, newEmail: email }, process.env.ACCESS_TOKEN, { expiresIn: "10m" });
            yield nodemailer_1.default.createTestAccount();
            const transporter = (0, utils_1.transporterFun)();
            yield transporter.sendMail((0, utils_1.mailOptionsForVerify)(email, token));
            return (0, utils_1.JsonOne)(res, 200, `Verification email sent to ${email}. Verify to complete email change.`, true);
        }
        // Update name only
        if (name) {
            user.name = name;
        }
        // Update dob - convert to ISO format
        if (dob) {
            user.dob = new Date(dob);
        }
        yield user.save();
        const updatedUser = yield models_1.User.findById(id).select("createdAt email isVerified name role _id lastLogin dob");
        if (!updatedUser) {
            return (0, utils_1.JsonOne)(res, 404, "User not found", false);
        }
        (0, utils_1.JsonOne)(res, 200, "Profile updated successfully", true, updatedUser);
    }
    catch (err) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while updating user");
    }
});
exports.updateProfile = updateProfile;
const verifyEmailChange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        if (!token) {
            return (0, utils_1.JsonOne)(res, 401, "Token not provided", false);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN);
        const user = yield models_1.User.findById(decoded.id);
        if (!user) {
            return (0, utils_1.JsonOne)(res, 404, "User not found", false);
        }
        // Update email
        user.email = decoded.newEmail;
        yield user.save();
        (0, utils_1.JsonOne)(res, 200, "Email changed successfully", true);
    }
    catch (err) {
        return (0, utils_1.JsonOne)(res, 400, "Invalid or expired token", false);
    }
});
exports.verifyEmailChange = verifyEmailChange;
//# sourceMappingURL=user.js.map