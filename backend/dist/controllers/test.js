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
const test_1 = __importDefault(require("../models/test"));
const user_1 = __importDefault(require("../models/user"));
const testAttempt_1 = __importDefault(require("../models/testAttempt"));
const responseFun_1 = require("../utils/responseFun");
const GenerateQuestions_1 = require("../utils/GenerateQuestions");
const notification_1 = require("../utils/notification");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, numOfQuestions, language, level } = req.body;
    try {
        const questions = yield (0, GenerateQuestions_1.generateQuestions)(language, level, numOfQuestions);
        const test = yield test_1.default.create({
            name,
            numOfQuestions,
            language,
            level,
            questions,
        });
        if (!test) {
            return (0, responseFun_1.JsonOne)(res, 500, "Failed to create test", false);
        }
        yield test.save();
        const users = yield user_1.default.find({ role: "user" });
        users.forEach((user) => {
            (0, notification_1.sendToUser)(user._id.toString(), {
                type: "info",
                message: `A new test titled '${test.name}' has been created.`,
                title: "New Test Available",
            });
        });
        (0, responseFun_1.JsonOne)(res, 201, `${name} created successfully  `, true);
    }
    catch (error) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while create test", false);
    }
});
exports.create = create;
//get all and unattempted tests
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search = "", sortOrder = "desc", page = "1", limit = "5", level = "All", onlyUnattempted = "false", userId, } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = sortOrder === "asc" ? 1 : -1;
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
            const attempts = yield testAttempt_1.default.find({ userId }).select("testId");
            const attemptedIds = attempts.map((a) => a.testId);
            matchStage["_id"] = { $nin: attemptedIds };
        }
        const aggregation = [
            { $match: matchStage },
            { $sort: { createdAt: sort } },
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
                $project: {
                    name: 1,
                    language: 1,
                    level: 1,
                    numOfQuestions: 1,
                    questions: 1,
                    createdAt: 1,
                },
            },
        ];
        const data = yield test_1.default.aggregate(aggregation);
        const total = yield test_1.default.countDocuments(matchStage);
        (0, responseFun_1.JsonAll)(res, 200, "Tests fetched successfully", data, total, parseInt(page), parseInt(limit));
    }
    catch (_a) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while fetching tests", false);
    }
});
exports.getAll = getAll;
const softDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return (0, responseFun_1.JsonOne)(res, 400, "Invalid test ID", false);
        }
        const deletedTest = yield test_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!deletedTest) {
            return (0, responseFun_1.JsonOne)(res, 404, "Test not found", false);
        }
        return (0, responseFun_1.JsonOne)(res, 200, "Test deleted successfully", true);
    }
    catch (error) {
        console.error("Soft delete error:", error);
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while delete test", false);
    }
});
exports.softDelete = softDelete;
const restore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return (0, responseFun_1.JsonOne)(res, 400, "Invalid test ID", false);
        }
        const deletedTest = yield test_1.default.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
        if (!deletedTest) {
            return (0, responseFun_1.JsonOne)(res, 404, "Test not found", false);
        }
        return (0, responseFun_1.JsonOne)(res, 200, "Test restored successfully", true);
    }
    catch (error) {
        console.error("Soft delete error:", error);
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while restore test", false);
    }
});
exports.restore = restore;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, numOfQuestions, language, level } = req.body;
        const { id } = req.params;
        const oldTest = yield test_1.default.findById(id);
        if (!oldTest) {
            return (0, responseFun_1.JsonOne)(res, 404, "Old Test not found", false);
        }
        //check required to generate que or not
        const shouldUpdateQuestions = oldTest.language !== language ||
            oldTest.level !== level ||
            oldTest.numOfQuestions !== numOfQuestions;
        let updatedFields = { name, numOfQuestions, language, level };
        if (shouldUpdateQuestions) {
            const newQuestions = yield (0, GenerateQuestions_1.generateQuestions)(language, level, numOfQuestions);
            updatedFields = Object.assign(Object.assign({}, updatedFields), { questions: newQuestions });
        }
        const updatedTest = yield test_1.default.findByIdAndUpdate(id, updatedFields, {
            new: true,
        });
        if (!updatedTest) {
            return (0, responseFun_1.JsonOne)(res, 404, "Test not found", false);
        }
        (0, responseFun_1.JsonOne)(res, 201, "test updated successfully", true);
    }
    catch (err) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while updating test", false);
    }
});
exports.edit = edit;
const getDeletedAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search = "", sortOrder = "desc", page = "1", limit = "5", level = "All", } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = sortOrder === "asc" ? 1 : -1;
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
        const aggregation = [
            { $match: matchStage },
            { $sort: { createdAt: sort } },
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
                $project: {
                    name: 1,
                    language: 1,
                    level: 1,
                    numOfQuestions: 1,
                    createdAt: 1,
                },
            },
        ];
        const data = yield test_1.default.aggregate(aggregation);
        const total = yield test_1.default.countDocuments(matchStage);
        (0, responseFun_1.JsonAll)(res, 200, "Deleted Tests fetched successfully", data, total, parseInt(page), parseInt(limit));
    }
    catch (_a) {
        (0, responseFun_1.JsonOne)(res, 500, "unexpected error occurred while sign up", false);
    }
});
exports.getDeletedAll = getDeletedAll;
//get completed test attempts and on going test attempts
const getOngoing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { user } = req.params;
        const userObjectId = new mongoose_1.default.Types.ObjectId(user);
        const { search = "", sortOrder = "desc", page = "1", limit = "5", level = "All", onlyOnGoing = "false", } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = sortOrder === "asc" ? 1 : -1;
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
                    { $limit: parseInt(limit) },
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
        const result = yield testAttempt_1.default.aggregate(aggregation);
        const data = result[0].data;
        const total = ((_a = result[0].total[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
        (0, responseFun_1.JsonAll)(res, 200, "Attempted Tests fetched successfully", data, total, parseInt(page), parseInt(limit));
    }
    catch (error) {
        (0, responseFun_1.JsonOne)(res, 500, "Unexpected error occurred while fetching attempted tests", false);
    }
});
exports.getOngoing = getOngoing;
//# sourceMappingURL=test.js.map