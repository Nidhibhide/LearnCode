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
exports.googleLogin = exports.updateProfile = exports.logOut = exports.getMe = exports.login = exports.registerUser = void 0;
const models_1 = require("../models");
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const google_auth_library_1 = require("google-auth-library");
const crypto_1 = __importDefault(require("crypto"));
const utils_1 = require("../utils");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield (0, utils_1.findUserByEmail)(email);
        if (existingUser) {
            return (0, utils_1.JsonOne)(res, 409, "User already exists ", false);
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
        });
        if (!user) {
            return (0, utils_1.JsonOne)(res, 500, "Failed to create user", false);
        }
        yield (0, utils_1.sendWelcomeMessage)(user._id.toString(), name);
        yield (0, utils_1.notifyAdminOfNewUser)(name);
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
// const googleLogin = async (req: Request, res: Response) => {
//   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//   const { token } = req.body;
//   try {
//     if (!token) {
//       return JsonOne(res, 404, "Google token not found", false);
//     }
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     const payload = ticket.getPayload();
//     if (!payload) return JsonOne(res, 401, "Invalid Google token", false);
//     const { email, name, sub } = payload;
//     if (!email || !name || !sub) {
//       return JsonOne(res, 400, "Incomplete Google user data", false);
//     }
//     let user = await User.findOne({ email });
//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//         password: sub,
//         isVerified: true,
//         role: "user",
//         authProvider: "google",
//       });
//       if (!user) {
//         return JsonOne(res, 500, "Failed to create user", false);
//       }
//       const hashedPass = await bcrypt.hash(sub, 10);
//       user.password = hashedPass;
//       await user.save();
//       await sendWelcomeMessage(user._id.toString(), name);
//       await notifyAdminOfNewUser(name);
//     }
//     const access_token = jwt.sign(
//       { id: user._id },
//       process.env.ACCESS_TOKEN as string,
//       {
//         expiresIn: "1h",
//       }
//     );
//     res.cookie("access_token", access_token, accessTokenOptions);
//     const refresh_token = jwt.sign(
//       { id: user._id },
//       process.env.REFRESH_TOKEN as string,
//       {
//         expiresIn: "7d",
//       }
//     );
//     res.cookie("refresh_token", refresh_token, refreshTokenOptions);
//     return JsonOne(res, 200, "Login successful", true);
//   } catch (err) {
//     JsonOne(res, 500, "Google login failed", false);
//   }
// };
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
        let user = yield models_1.User.findOne({ email });
        if (!user) {
            const hashedPass = yield bcryptjs_1.default.hash(sub, 10);
            user = yield models_1.User.create({
                name,
                email,
                password: hashedPass,
                isVerified: true,
                role: "user",
                authProvider: "google",
            });
        }
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
        const { password, email } = req.body;
        const user = yield (0, utils_1.findUserByEmail)(email);
        if (!user || !user.password) {
            return (0, utils_1.JsonOne)(res, 404, "User or password not found", false);
        }
        if (!user.isVerified) {
            return (0, utils_1.JsonOne)(res, 400, "User is not verified", false);
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return (0, utils_1.JsonOne)(res, 401, "Incorrect password", false);
        }
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
        const { name, email } = req.body;
        const { id } = req.params;
        const user = yield models_1.User.findById(id);
        if ((user === null || user === void 0 ? void 0 : user.authProvider) === "google" && email !== (user === null || user === void 0 ? void 0 : user.email)) {
            return (0, utils_1.JsonOne)(res, 400, "Cannot update email for Google-authenticated users", false);
        }
        const updatedUser = yield models_1.User.findByIdAndUpdate(id, { name, email }, { new: true }).select("createdAt email isVerified name role _id");
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
//# sourceMappingURL=user.js.map