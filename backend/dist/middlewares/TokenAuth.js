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
const responseFun_1 = require("../utils/responseFun");
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const IsLoggeedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const access_token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
        if (!access_token) {
            return (0, responseFun_1.JsonOne)(res, 400, "Token not found", false);
        }
        const decode = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
        const userID = decode.id;
        const user = yield user_1.default.findById(userID).select("name  email   role   isVerified createdAt ");
        if (!user) {
            return (0, responseFun_1.JsonOne)(res, 404, "User not found", false);
        }
        req.user = user;
        next();
    }
    catch (error) {
        return (0, responseFun_1.JsonOne)(res, 400, "Invalid or expired  Access Token", false);
    }
});
exports.default = IsLoggeedIn;
//# sourceMappingURL=TokenAuth.js.map