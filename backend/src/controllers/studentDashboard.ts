import TestAttemptModel from "../models/testAttempt";
import { Request, Response } from "express";
import { JsonOne, JsonAll, getPaginationParams, handleError } from "../utils";
import mongoose from "mongoose";

// Get current user's test stats for MyScores page
const getMyStats = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const userId = (user as any)._id;

    // Get totalSolved (only completed tests)
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
          totalCorrect: { $sum: { $size: { $ifNull: ["$correctQuestionIds", []] } } },
          totalWrong: { $sum: { $size: { $ifNull: ["$wrongQuestionIds", []] } } },
          totalRemaining: { $sum: { $size: { $ifNull: ["$remainingQuestionIds", []] } } },
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

    // Get totalSubmissions (all attempts, not just completed)
    const totalSubmissionsData = await TestAttemptModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId.toString()),
        },
      },
      {
        $project: {
          _id: 0,
          correct: { $size: { $ifNull: ["$correctQuestionIds", []] } },
          wrong: { $size: { $ifNull: ["$wrongQuestionIds", []] } },
          remaining: { $size: { $ifNull: ["$remainingQuestionIds", []] } },
          counts: { $objectToArray: "$questionSubmissionCounts" },
        },
      },
      {
        $unwind: {
          path: "$counts",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          totalCorrect: { $sum: "$correct" },
          totalWrong: { $sum: "$wrong" },
          totalRemaining: { $sum: "$remaining" },
          totalSubmissions: { $sum: "$counts.v" },
        },
      },
    ]);

    const stats = userStats[0] || {
      totalSolved: 0,
      basic: 0,
      intermediate: 0,
      advanced: 0,
    };

    const submissionsData = totalSubmissionsData[0] || {
      totalCorrect: 0,
      totalWrong: 0,
      totalRemaining: 0,
      totalSubmissions: 0,
    };

    const totalQuestions = submissionsData.totalCorrect + submissionsData.totalWrong + submissionsData.totalRemaining;
    const acceptanceRate = totalQuestions > 0 ? Math.round((submissionsData.totalCorrect / totalQuestions) * 100) : 0;

    return JsonOne(res, 200, "Stats fetched successfully", true, {
      totalSolved: stats.totalSolved,
      totalSubmissions: submissionsData.totalSubmissions,
      acceptanceRate: acceptanceRate,
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

    return JsonOne(
      res,
      200,
      "Activity fetched successfully",
      true,
      activityData,
    );
  } catch (error) {
    return handleError(res, "Error fetching my activity");
  }
};

// Get current user's solved tests for Scoreboard table with filters and pagination
const getMySolvedTests = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const userId = (user as any)._id;

    const { search, level, language } = req.query as {
      search?: string;
      level?: string;
      language?: string;
    };

    const { skip, page, limit } = getPaginationParams(req);

    // Build match conditions
    const userMatch = {
      userId: new mongoose.Types.ObjectId(userId.toString()),
    };

    const testMatch: any = {};
    if (level && level !== "All") {
      testMatch["testData.level"] = level;
    }
    if (language && language !== "All") {
      testMatch["testData.language"] = language;
    }

    const aggregation = [
      { $match: userMatch },
      {
        $lookup: {
          from: "tests",
          localField: "testId",
          foreignField: "_id",
          as: "testData",
        },
      },
      { $unwind: { path: "$testData", preserveNullAndEmptyArrays: true } },
      // Apply test-level filters
      { $match: testMatch },
      // Unwind questions to get one row per question
      {
        $unwind: {
          path: "$testData.questions",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Add status field: correct, wrong, or not attempted
      {
        $addFields: {
          status: {
            $cond: {
              if: { $in: ["$testData.questions._id", "$correctQuestionIds"] },
              then: "correct",
              else: {
                $cond: {
                  if: { $in: ["$testData.questions._id", "$wrongQuestionIds"] },
                  then: "wrong",
                  else: "not_attempted",
                },
              },
            },
          },
        },
      },
      // Search filter on test name or question text
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "testData.name": { $regex: search, $options: "i" } },
                  {
                    "testData.questions.questionText": {
                      $regex: search,
                      $options: "i",
                    },
                  },
                ],
              },
            },
          ]
        : []),
      // Facet for pagination and count
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: "$testData.questions._id",
                questionName: "$testData.questions.questionText",
                testName: "$testData.name",
                language: "$testData.language",
                level: "$testData.level",
                status: 1,
                submittedAt: "$createdAt",
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
      "Solved tests fetched successfully",
      data,
      total,
      page,
      limit,
    );
  } catch (error) {
    return handleError(res, "Error fetching solved tests");
  }
};

export {
  getMyStats,
  getMyLanguages,
  getMyActivity,
  getMySolvedTests,
};
