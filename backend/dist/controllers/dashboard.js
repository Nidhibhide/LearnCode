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
exports.getMyActivity = exports.getMyLanguages = exports.getMyStats = exports.getLeaderboard = exports.getWeeklyActivity = exports.getDifficultyStats = exports.getLanguageStats = exports.getUserStats = void 0;
const models_1 = require("../models");
const testAttempt_1 = __importDefault(require("../models/testAttempt"));
const utils_1 = require("../utils");
const mongoose_1 = __importDefault(require("mongoose"));
// Get user statistics for admin dashboard
const getUserStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const totalUsers = yield models_1.User.countDocuments({ role: "student" });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayActiveResult = yield testAttempt_1.default.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: today,
                        $lt: tomorrow,
                    },
                },
            },
            {
                $group: {
                    _id: "$userId",
                },
            },
            {
                $count: "uniqueUsers",
            },
        ]);
        const todayActive = ((_a = todayActiveResult[0]) === null || _a === void 0 ? void 0 : _a.uniqueUsers) || 0;
        const testsCompleted = yield testAttempt_1.default.countDocuments({
            completedAt: { $ne: null },
        });
        const attemptsWithQuestions = yield testAttempt_1.default.aggregate([
            {
                $lookup: {
                    from: "tests",
                    localField: "testId",
                    foreignField: "_id",
                    as: "testData",
                },
            },
            { $unwind: { path: "$testData", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    correctCount: { $size: { $ifNull: ["$correctQuestionIds", []] } },
                    totalQuestions: { $size: { $ifNull: ["$testData.questions", []] } },
                },
            },
            {
                $group: {
                    _id: null,
                    totalCorrect: { $sum: "$correctCount" },
                    totalQuestionsAttempted: { $sum: "$totalQuestions" },
                },
            },
        ]);
        const stats = attemptsWithQuestions[0] || {
            totalCorrect: 0,
            totalQuestionsAttempted: 0,
        };
        const passRate = stats.totalQuestionsAttempted > 0
            ? Math.round((stats.totalCorrect / stats.totalQuestionsAttempted) * 100)
            : 0;
        const totalStarted = yield testAttempt_1.default.countDocuments({});
        const completionRate = totalStarted > 0 ? Math.round((testsCompleted / totalStarted) * 100) : 0;
        const userStats = {
            totalUsers,
            todayActive,
            testsCompleted,
            passRate,
            completionRate,
        };
        return (0, utils_1.JsonOne)(res, 200, "User stats fetched successfully", true, userStats);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "Error fetching user stats");
    }
});
exports.getUserStats = getUserStats;
// Get most attempted languages for admin dashboard
const getLanguageStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const languageStats = yield testAttempt_1.default.aggregate([
            {
                $lookup: {
                    from: "tests",
                    localField: "testId",
                    foreignField: "_id",
                    as: "test",
                },
            },
            {
                $unwind: "$test",
            },
            {
                $group: {
                    _id: "$test.language",
                    attempts: { $sum: 1 },
                },
            },
            {
                $project: {
                    name: "$_id",
                    attempts: 1,
                    _id: 0,
                },
            },
            {
                $sort: { attempts: -1 },
            },
        ]);
        return (0, utils_1.JsonOne)(res, 200, "Language stats fetched successfully", true, languageStats);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "Error fetching language stats");
    }
});
exports.getLanguageStats = getLanguageStats;
// Get difficulty distribution for admin dashboard
const getDifficultyStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const difficultyStats = yield testAttempt_1.default.aggregate([
            {
                $lookup: {
                    from: "tests",
                    localField: "testId",
                    foreignField: "_id",
                    as: "test",
                },
            },
            {
                $unwind: "$test",
            },
            {
                $group: {
                    _id: "$test.level",
                    value: { $sum: 1 },
                },
            },
            {
                $project: {
                    name: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id", "Basic"] }, then: "Easy" },
                                { case: { $eq: ["$_id", "Intermediate"] }, then: "Medium" },
                                { case: { $eq: ["$_id", "Advanced"] }, then: "Hard" },
                            ],
                            default: "$_id",
                        },
                    },
                    value: 1,
                    _id: 0,
                },
            },
            {
                $sort: { value: -1 },
            },
        ]);
        return (0, utils_1.JsonOne)(res, 200, "Difficulty stats fetched successfully", true, difficultyStats);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "Error fetching difficulty stats");
    }
});
exports.getDifficultyStats = getDifficultyStats;
// Get weekly activity for admin dashboard (test attempts grouped by day of current week)
const getWeeklyActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
        startOfWeek.setHours(0, 0, 0, 0);
        const weeklyActivity = yield testAttempt_1.default.aggregate([
            { $match: { createdAt: { $gte: startOfWeek } } },
            { $group: { _id: { $dayOfWeek: "$createdAt" }, tests: { $sum: 1 } } },
            {
                $project: {
                    name: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id", 1] }, then: "Sun" },
                                { case: { $eq: ["$_id", 2] }, then: "Mon" },
                                { case: { $eq: ["$_id", 3] }, then: "Tue" },
                                { case: { $eq: ["$_id", 4] }, then: "Wed" },
                                { case: { $eq: ["$_id", 5] }, then: "Thu" },
                                { case: { $eq: ["$_id", 6] }, then: "Fri" },
                                { case: { $eq: ["$_id", 7] }, then: "Sat" },
                            ],
                            default: "Unknown",
                        },
                    },
                    tests: 1,
                    _id: 0,
                },
            },
            { $sort: { name: 1 } },
        ]);
        const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const weeklyData = daysOrder.map((day) => {
            const found = weeklyActivity.find((item) => item.name === day);
            return found || { name: day, tests: 0 };
        });
        return (0, utils_1.JsonOne)(res, 200, "Weekly activity fetched successfully", true, weeklyData);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "Error fetching weekly activity");
    }
});
exports.getWeeklyActivity = getWeeklyActivity;
// Get leaderboard with time-based filters and pagination
const getLeaderboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { filter = "overall" } = req.query;
        const { skip, sort, page, limit } = (0, utils_1.getPaginationParams)(req);
        const now = new Date();
        let startDate = undefined;
        switch (filter) {
            case "weekly":
                startDate = new Date(now);
                startDate.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
                startDate.setHours(0, 0, 0, 0);
                break;
            case "overall":
            default:
                startDate = undefined;
                break;
        }
        const matchCondition = startDate ? { createdAt: { $gte: startDate } } : {};
        const aggregation = [
            { $match: matchCondition },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData",
                },
            },
            { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "tests",
                    localField: "testId",
                    foreignField: "_id",
                    as: "testData",
                },
            },
            { $unwind: { path: "$testData", preserveNullAndEmptyArrays: true } },
            { $sort: { score: -1 } },
            {
                $group: {
                    _id: "$userId",
                    bestScore: { $first: "$score" },
                    userData: { $first: "$userData" },
                    language: { $first: "$testData.language" },
                },
            },
            { $sort: { bestScore: sort } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 0,
                                userId: "$_id",
                                name: { $ifNull: ["$userData.name", "Unknown"] },
                                email: { $ifNull: ["$userData.email", "Unknown"] },
                                score: "$bestScore",
                                language: 1,
                            },
                        },
                    ],
                    total: [{ $count: "count" }],
                },
            },
        ];
        const result = yield testAttempt_1.default.aggregate(aggregation);
        const data = result[0].data;
        const total = ((_a = result[0].total[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
        return (0, utils_1.JsonAll)(res, 200, "Leaderboard fetched successfully", data, total, page, limit);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "Error fetching leaderboard");
    }
});
exports.getLeaderboard = getLeaderboard;
// Get current user's test stats for MyScores page
const getMyStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = user._id;
        const userStats = yield testAttempt_1.default.aggregate([
            {
                $match: {
                    userId: new mongoose_1.default.Types.ObjectId(userId.toString()),
                    completedAt: { $ne: null },
                },
            },
            {
                $lookup: {
                    from: "tests",
                    localField: "testId",
                    foreignField: "_id",
                    as: "testData",
                },
            },
            {
                $unwind: {
                    path: "$testData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: null,
                    totalSolved: { $sum: 1 },
                    basic: {
                        $sum: {
                            $cond: [{ $eq: ["$testData.level", "Basic"] }, 1, 0],
                        },
                    },
                    intermediate: {
                        $sum: {
                            $cond: [{ $eq: ["$testData.level", "Intermediate"] }, 1, 0],
                        },
                    },
                    advanced: {
                        $sum: {
                            $cond: [{ $eq: ["$testData.level", "Advanced"] }, 1, 0],
                        },
                    },
                },
            },
        ]);
        const stats = userStats[0] || {
            totalSolved: 0,
            basic: 0,
            intermediate: 0,
            advanced: 0,
        };
        return (0, utils_1.JsonOne)(res, 200, "Stats fetched successfully", true, {
            totalSolved: stats.totalSolved,
            basic: stats.basic,
            intermediate: stats.intermediate,
            advanced: stats.advanced,
        });
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "Error fetching my stats");
    }
});
exports.getMyStats = getMyStats;
// Get current user's languages with solved counts for Tech Stack section
const getMyLanguages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = user._id;
        const languageStats = yield testAttempt_1.default.aggregate([
            {
                $match: {
                    userId: new mongoose_1.default.Types.ObjectId(userId.toString()),
                    completedAt: { $ne: null },
                },
            },
            {
                $lookup: {
                    from: "tests",
                    localField: "testId",
                    foreignField: "_id",
                    as: "testData",
                },
            },
            {
                $unwind: {
                    path: "$testData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$testData.language",
                    solvedCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    solvedCount: 1,
                },
            },
            {
                $sort: { solvedCount: -1 },
            },
        ]);
        // Map language names to icons using TEST_LANGUAGES constant
        const getLangIcon = (name) => {
            if (name === "Java")
                return "☕";
            if (name === "C++")
                return "🔵";
            if (name === "JavaScript")
                return "🟨";
            if (name === "Python")
                return "🐍";
            if (name === "C")
                return "⚪";
            return "📄";
        };
        const languages = languageStats.map((lang) => ({
            name: lang.name || "Unknown",
            solvedCount: lang.solvedCount,
            icon: getLangIcon(lang.name || ""),
        }));
        return (0, utils_1.JsonOne)(res, 200, "Languages fetched successfully", true, languages);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "Error fetching my languages");
    }
});
exports.getMyLanguages = getMyLanguages;
// Get current user's activity (submission counts by date) for Activity Calendar
const getMyActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = user._id;
        const { year, month } = req.query;
        // Default to current month if not provided
        const currentDate = new Date();
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth();
        // Start and end of the target month
        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
        //Setting day to 0 gives the last day of the previous month
        const activityData = yield testAttempt_1.default.aggregate([
            {
                $match: {
                    userId: new mongoose_1.default.Types.ObjectId(userId.toString()),
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    count: 1,
                },
            },
            {
                $sort: { date: 1 },
            },
        ]);
        return (0, utils_1.JsonOne)(res, 200, "Activity fetched successfully", true, activityData);
    }
    catch (error) {
        return (0, utils_1.handleError)(res, "Error fetching my activity");
    }
});
exports.getMyActivity = getMyActivity;
//# sourceMappingURL=dashboard.js.map