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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.update = exports.create = void 0;
//create test attempt
const models_1 = require("../models");
const utils_1 = require("../utils");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, testId, remainingQuestionIds } = req.body;
    try {
        const test = yield models_1.TestAttempt.create({
            userId,
            testId,
            remainingQuestionIds,
        });
        if (!test) {
            return (0, utils_1.JsonOne)(res, 500, "Failed to create test Attempt", false);
        }
        (0, utils_1.JsonOne)(res, 201, "Test attempt created successfully", true);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while create test Attempt");
    }
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionId, flag } = req.body;
        const { id } = req.params;
        const attempt = yield models_1.TestAttempt.findById(id);
        if (!attempt) {
            return (0, utils_1.JsonOne)(res, 404, "Test Attempt not found", false);
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
        if (attempt.remainingQuestionIds.length === 0) {
            attempt.completedAt = new Date();
        }
        yield attempt.save();
        (0, utils_1.JsonOne)(res, 200, "Attempt updated successfully", true);
    }
    catch (err) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while updating test Attempt");
    }
});
exports.update = update;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { search = "", level = "All", } = req.query;
        const { skip, sort, page, limit } = (0, utils_1.getPaginationParams)(req);
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
                    { $limit: limit },
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
        const result = yield models_1.TestAttempt.aggregate(aggregation);
        const data = result[0].data;
        const total = ((_a = result[0].total[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
        (0, utils_1.JsonAll)(res, 200, "Test Attempts fetched successfully", data, total, page, limit);
    }
    catch (_b) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while fetching test attempts");
    }
});
exports.getAll = getAll;
//# sourceMappingURL=testAttempt.js.map