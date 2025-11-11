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
exports.getOngoing = exports.getDeletedAll = exports.edit = exports.restore = exports.softDelete = exports.getAll = exports.create = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, numOfQuestions, language, level } = req.body;
    try {
        const questions = yield (0, utils_1.generateQuestions)(language, level, numOfQuestions);
        const test = yield models_1.Test.create({
            name,
            numOfQuestions,
            language,
            level,
            questions,
        });
        if (!test) {
            return (0, utils_1.JsonOne)(res, 500, "Failed to create test", false);
        }
        const users = yield models_1.User.find({ role: "user" });
        users.forEach((user) => {
            (0, utils_1.sendToUser)(user._id.toString(), {
                type: "info",
                message: `A new test titled '${test.name}' has been created.`,
                title: "New Test Available",
            });
        });
        (0, utils_1.JsonOne)(res, 201, `${name} created successfully  `, true);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while create test");
    }
});
exports.create = create;
//get all and unattempted tests
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search = "", level = "All", onlyUnattempted = "false", userId, } = req.query;
        const { skip, sort, page, limit } = (0, utils_1.getPaginationParams)(req);
        const matchStage = {
            isDeleted: false,
            $or: [
                { name: { $regex: search, $options: "i" } },
                { language: { $regex: search, $options: "i" } },
            ],
        };
        if (level && level !== "All") {
            matchStage["level"] = level;
        }
        // Apply unattempted test filter if required
        if (onlyUnattempted === "true" && userId) {
            const attempts = yield models_1.TestAttempt.find({ userId }).select("testId");
            const attemptedIds = attempts.map((a) => a.testId);
            matchStage["_id"] = { $nin: attemptedIds };
        }
        const aggregation = (0, utils_1.buildAggregationPipeline)(matchStage, sort, skip, limit, {
            name: 1,
            language: 1,
            level: 1,
            numOfQuestions: 1,
            questions: 1,
            createdAt: 1,
        });
        const data = yield models_1.Test.aggregate(aggregation);
        const total = yield models_1.Test.countDocuments(matchStage);
        (0, utils_1.JsonAll)(res, 200, "Tests fetched successfully", data, total, page, limit);
    }
    catch (_a) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while fetching tests");
    }
});
exports.getAll = getAll;
const softDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return (0, utils_1.JsonOne)(res, 400, "Invalid test ID", false);
        }
        const deletedTest = yield models_1.Test.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!deletedTest) {
            return (0, utils_1.JsonOne)(res, 404, "Test not found", false);
        }
        return (0, utils_1.JsonOne)(res, 200, "Test deleted successfully", true);
    }
    catch (error) {
        console.error("Soft delete error:", error);
        return (0, utils_1.handleError)(res, "unexpected error occurred while delete test");
    }
});
exports.softDelete = softDelete;
const restore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return (0, utils_1.JsonOne)(res, 400, "Invalid test ID", false);
        }
        const deletedTest = yield models_1.Test.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
        if (!deletedTest) {
            return (0, utils_1.JsonOne)(res, 404, "Test not found", false);
        }
        return (0, utils_1.JsonOne)(res, 200, "Test restored successfully", true);
    }
    catch (error) {
        console.error("Soft restore error:", error);
        return (0, utils_1.handleError)(res, "unexpected error occurred while restore test");
    }
});
exports.restore = restore;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, numOfQuestions, language, level } = req.body;
        const { id } = req.params;
        const oldTest = yield models_1.Test.findById(id);
        if (!oldTest) {
            return (0, utils_1.JsonOne)(res, 404, "Old Test not found", false);
        }
        const shouldUpdateQuestions = oldTest.language !== language ||
            oldTest.level !== level ||
            oldTest.numOfQuestions !== numOfQuestions;
        const updatedFields = { name, numOfQuestions, language, level };
        if (shouldUpdateQuestions) {
            const newQuestions = yield (0, utils_1.generateQuestions)(language, level, numOfQuestions);
            updatedFields.questions = newQuestions;
        }
        const updatedTest = yield models_1.Test.findByIdAndUpdate(id, updatedFields, {
            new: true,
        });
        if (!updatedTest) {
            return (0, utils_1.JsonOne)(res, 404, "Test not found", false);
        }
        (0, utils_1.JsonOne)(res, 200, "test updated successfully", true);
    }
    catch (err) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while updating test");
    }
});
exports.edit = edit;
const getDeletedAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search = "", level = "All", } = req.query;
        const { skip, sort, page, limit } = (0, utils_1.getPaginationParams)(req);
        const matchStage = {
            isDeleted: true,
            $or: [
                { name: { $regex: search, $options: "i" } },
                { language: { $regex: search, $options: "i" } },
            ],
        };
        if (level && level !== "All") {
            matchStage["level"] = level;
        }
        const aggregation = (0, utils_1.buildAggregationPipeline)(matchStage, sort, skip, limit, {
            name: 1,
            language: 1,
            level: 1,
            numOfQuestions: 1,
            createdAt: 1,
        });
        const data = yield models_1.Test.aggregate(aggregation);
        const total = yield models_1.Test.countDocuments(matchStage);
        (0, utils_1.JsonAll)(res, 200, "Deleted Tests fetched successfully", data, total, page, limit);
    }
    catch (_a) {
        return (0, utils_1.handleError)(res, "unexpected error occurred while fetching deleted tests");
    }
});
exports.getDeletedAll = getDeletedAll;
//get completed test attempts and on going test attempts
const getOngoing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { user } = req.params;
        const userObjectId = new mongoose_1.default.Types.ObjectId(user);
        const { search = "", level = "All", onlyOnGoing = "false", } = req.query;
        const { skip, sort, page, limit } = (0, utils_1.getPaginationParams)(req);
        const aggregation = [
            { $match: { userId: userObjectId } },
            {
                $lookup: {
                    from: "tests",
                    localField: "testId",
                    foreignField: "_id",
                    as: "test",
                },
            },
            { $unwind: "$test" },
        ];
        const matchStage = {
            $or: [
                { "test.name": { $regex: search, $options: "i" } },
                { "test.language": { $regex: search, $options: "i" } },
            ],
        };
        if (onlyOnGoing === "true") {
            matchStage.completedAt = null;
        }
        else if (onlyOnGoing === "false") {
            matchStage.completedAt = { $ne: null };
        }
        if (level !== "All") {
            matchStage["test.level"] = level;
        }
        if (Object.keys(matchStage).length > 0) {
            aggregation.push({ $match: matchStage });
        }
        aggregation.push({
            $facet: {
                data: [
                    { $sort: { completedAt: sort } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            testId: "$test._id",
                            name: "$test.name",
                            language: "$test.language",
                            level: "$test.level",
                            numOfQuestions: "$test.numOfQuestions",
                            questions: "$test.questions",
                            score: 1,
                            completedAt: 1,
                            correctQuestionIds: 1,
                            wrongQuestionIds: 1,
                            remainingQuestionIds: 1,
                        },
                    },
                ],
                total: [{ $count: "count" }],
            },
        });
        const result = yield models_1.TestAttempt.aggregate(aggregation);
        const data = result[0].data;
        const total = ((_a = result[0].total[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
        (0, utils_1.JsonAll)(res, 200, "Attempted Tests fetched successfully", data, total, page, limit);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "Unexpected error occurred while fetching attempted tests");
    }
});
exports.getOngoing = getOngoing;
//# sourceMappingURL=test.js.map