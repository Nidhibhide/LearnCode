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
exports.verifyToken = exports.findUserByEmail = exports.handleError = exports.buildAggregationPipeline = exports.getPaginationParams = void 0;
const responseFun_1 = require("./responseFun");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const getPaginationParams = (req) => {
    const { sortOrder = "desc", page = "1", limit = "5", } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = sortOrder === "asc" ? 1 : -1;
    return {
        skip,
        sort,
        page: parseInt(page),
        limit: parseInt(limit),
    };
};
exports.getPaginationParams = getPaginationParams;
const buildAggregationPipeline = (matchStage, sort, skip, limit, project) => {
    return [
        { $match: matchStage },
        { $sort: { createdAt: sort } },
        { $skip: skip },
        { $limit: limit },
        { $project: project },
    ];
};
exports.buildAggregationPipeline = buildAggregationPipeline;
const handleError = (res, message) => {
    return (0, responseFun_1.JsonOne)(res, 500, message, false);
};
exports.handleError = handleError;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findOne({ email });
});
exports.findUserByEmail = findUserByEmail;
const verifyToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (_a) {
        return null;
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=commonHandlers.js.map