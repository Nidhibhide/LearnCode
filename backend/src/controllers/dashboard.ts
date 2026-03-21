import { User } from "../models";
import TestAttemptModel from "../models/testAttempt";
import TestModel from "../models/test";
import { Request, Response } from "express";
import { JsonOne, JsonAll, getPaginationParams, handleError } from "../utils";
import mongoose from "mongoose";

// Get user statistics for admin dashboard
const getUserStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ role: "student" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayActiveResult = await TestAttemptModel.aggregate([
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

    const todayActive = todayActiveResult[0]?.uniqueUsers || 0;

    const testsCompleted = await TestAttemptModel.countDocuments({
      completedAt: { $ne: null },
    });

    const attemptsWithQuestions = await TestAttemptModel.aggregate([
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
    const passRate =
      stats.totalQuestionsAttempted > 0
        ? Math.round((stats.totalCorrect / stats.totalQuestionsAttempted) * 100)
        : 0;

    const totalStarted = await TestAttemptModel.countDocuments({});
    const completionRate =
      totalStarted > 0 ? Math.round((testsCompleted / totalStarted) * 100) : 0;

    const userStats = {
      totalUsers,
      todayActive,
      testsCompleted,
      passRate,
      completionRate,
    };

    return JsonOne(
      res,
      200,
      "User stats fetched successfully",
      true,
      userStats,
    );
  } catch (error) {
    return handleError(res, "Error fetching user stats");
  }
};

// Get most attempted languages for admin dashboard
const getLanguageStats = async (req: Request, res: Response) => {
  try {
    const languageStats = await TestAttemptModel.aggregate([
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

    return JsonOne(
      res,
      200,
      "Language stats fetched successfully",
      true,
      languageStats,
    );
  } catch (error) {
    return handleError(res, "Error fetching language stats");
  }
};

// Get difficulty distribution for admin dashboard
const getDifficultyStats = async (req: Request, res: Response) => {
  try {
    const difficultyStats = await TestAttemptModel.aggregate([
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

    return JsonOne(
      res,
      200,
      "Difficulty stats fetched successfully",
      true,
      difficultyStats,
    );
  } catch (error) {
    return handleError(res, "Error fetching difficulty stats");
  }
};

// Get weekly activity for admin dashboard (test attempts grouped by day of current week)
const getWeeklyActivity = async (req: Request, res: Response) => {
  try {
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1),
    );
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyActivity = await TestAttemptModel.aggregate([
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

    return JsonOne(
      res,
      200,
      "Weekly activity fetched successfully",
      true,
      weeklyData,
    );
  } catch (error) {
    return handleError(res, "Error fetching weekly activity");
  }
};

// Get leaderboard with time-based filters and pagination
const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { filter = "overall" } = req.query as {
      filter?: string;
    };

    const { skip, sort, page, limit } = getPaginationParams(req);

    const now = new Date();
    let startDate: Date | undefined = undefined;

    switch (filter) {
      case "weekly":
        startDate = new Date(now);
        startDate.setDate(
          now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1),
        );
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

    const result = await TestAttemptModel.aggregate(aggregation as any);
    const data = result[0].data;
    const total = result[0].total[0]?.count || 0;

    return JsonAll(
      res,
      200,
      "Leaderboard fetched successfully",
      data,
      total,
      page,
      limit,
    );
  } catch (error) {
    return handleError(res, "Error fetching leaderboard");
  }
};

// Get current user's test stats for MyScores page
const getMyStats = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const userId = (user as any)._id;

    const userStats = await TestAttemptModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId.toString()),
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

    return JsonOne(res, 200, "Stats fetched successfully", true, {
      totalSolved: stats.totalSolved,
      basic: stats.basic,
      intermediate: stats.intermediate,
      advanced: stats.advanced,
    });
  } catch (error) {
    return handleError(res, "Error fetching my stats");
  }
};
// Get current user's languages with solved counts for Tech Stack section
const getMyLanguages = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const userId = (user as any)._id;

    const languageStats = await TestAttemptModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId.toString()),
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
    const getLangIcon = (name: string) => {
      if (name === "Java") return "☕";
      if (name === "C++") return "🔵";
      if (name === "JavaScript") return "🟨";
      if (name === "Python") return "🐍";
      if (name === "C") return "⚪";
      return "📄";
    };

    const languages = languageStats.map((lang) => ({
      name: lang.name || "Unknown",
      solvedCount: lang.solvedCount,
      icon: getLangIcon(lang.name || ""),
    }));

    return JsonOne(res, 200, "Languages fetched successfully", true, languages);
  } catch (error) {
    return handleError(res, "Error fetching my languages");
  }
};

// Get current user's activity (submission counts by date) for Activity Calendar
const getMyActivity = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const userId = (user as any)._id;
    const { year, month } = req.query as { year?: string; month?: string };

    // Default to current month if not provided
    const currentDate = new Date();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();
    const targetMonth = month ? parseInt(month) : currentDate.getMonth();

    // Start and end of the target month
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
    //Setting day to 0 gives the last day of the previous month

    const activityData = await TestAttemptModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId.toString()),
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

    return JsonOne(res, 200, "Activity fetched successfully", true, activityData);
  } catch (error) {
    return handleError(res, "Error fetching my activity");
  }
};

export {
  getUserStats,
  getLanguageStats,
  getDifficultyStats,
  getWeeklyActivity,
  getLeaderboard,
  getMyStats,
  getMyLanguages,
  getMyActivity,
};
