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
exports.getAll = exports.update = exports.create = void 0;
//create test attempt
const testAttempt_1 = __importDefault(require("../models/testAttempt"));
const responseFun_1 = require("../utils/responseFun");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, testId, remainingQuestionIds } = req.body;
    try {
        const test = yield testAttempt_1.default.create({
            userId,
            testId,
            remainingQuestionIds,
        });
        if (!test) {
            return (0, responseFun_1.JsonOne)(res, 500, "Failed to create test Attempt", false);
        }
        yield test.save();
        (0, responseFun_1.JsonOne)(res, 201, "Test attempt created successfully", true);
    }
    catch (error) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while create test Attempt", false);
    }
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionId, flag } = req.body;
        const { id } = req.params; //attempt id
        const attempt = yield testAttempt_1.default.findById(id);
        if (!attempt) {
            return (0, responseFun_1.JsonOne)(res, 404, "Test Attempt not found", false);
        }
        attempt.remainingQuestionIds = attempt.remainingQuestionIds.filter((id) => id.toString() !== questionId);
        if (flag) {
            if (!attempt.correctQuestionIds.includes(questionId)) {
                attempt.correctQuestionIds.push(questionId);
                attempt.score += 10;
            }
        }
        else {
            if (!attempt.wrongQuestionIds.includes(questionId)) {
                attempt.wrongQuestionIds.push(questionId);
            }
        }
        if ((attempt === null || attempt === void 0 ? void 0 : attempt.remainingQuestionIds.length) === 0) {
            attempt.completedAt = new Date();
        }
        yield attempt.save();
        (0, responseFun_1.JsonOne)(res, 201, "Attempt updated successfully", true);
    }
    catch (err) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while updating test Attempt", false);
    }
});
exports.update = update;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { search = "", sortOrder = "desc", page = "1", limit = "5", level = "All", } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = sortOrder === "asc" ? 1 : -1;
        const aggregation = [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData",
                },
            },
            { $unwind: "$userData" },
            {
                $lookup: {
                    from: "tests",
                    localField: "testId",
                    foreignField: "_id",
                    as: "testData",
                },
            },
            { $unwind: "$testData" },
        ];
        const matchStage = {
            $or: [
                { "testData.name": { $regex: search, $options: "i" } },
                { "testData.language": { $regex: search, $options: "i" } },
            ],
        };
        if (level !== "All") {
            matchStage["testData.level"] = level;
        }
        aggregation.push({ $match: matchStage });
        aggregation.push({
            $facet: {
                data: [
                    { $sort: { createdAt: sort } },
                    { $skip: skip },
                    { $limit: parseInt(limit) },
                    {
                        $project: {
                            score: 1,
                            completedAt: 1,
                            createdAt: 1,
                            name: "$userData.name",
                            email: "$userData.email",
                            test: "$testData.name",
                            language: "$testData.language",
                            level: "$testData.level",
                        },
                    },
                ],
                total: [{ $count: "count" }],
            },
        });
        const result = yield testAttempt_1.default.aggregate(aggregation);
        const data = result[0].data;
        const total = ((_a = result[0].total[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
        (0, responseFun_1.JsonAll)(res, 200, "Test Attempts fetched successfully", data, total, parseInt(page), parseInt(limit));
    }
    catch (_b) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while sign up", false);
    }
});
exports.getAll = getAll;
//# sourceMappingURL=testAttempt.js.map