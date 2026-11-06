//create test attempt
import mongoose from "mongoose";
import { TestAttempt } from "../models";
import { JsonOne, JsonAll, getPaginationParams, buildAggregationPipeline, handleError } from "../utils";
import { Request, Response } from "express";
import { TEST_LANGUAGES, TEST_LEVELS } from "../constants";
const create = async (req: Request, res: Response) => {
  const { userId, testId, remainingQuestionIds } = req.body;

  try {
    const test = await TestAttempt.create({
      userId,
      testId,
      remainingQuestionIds,
    });

    if (!test) {
      return JsonOne(res, 500, "Failed to create test Attempt", false);
    }

    JsonOne(res, 201, "Test attempt created successfully", true, test);
  } catch (error) {
    return handleError(res, "unexpected error occurred while create test Attempt");
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { questionId, flag, submissionCount, code } = req.body;
    const { id } = req.params;

    const attempt = await TestAttempt.findById(id);
    if (!attempt) {
      return JsonOne(res, 404, "Test Attempt not found", false);
    }

    if (!questionId) {
      return JsonOne(res, 400, "questionId is required", false);
    }

    const questionIdStr = questionId.toString();

    // Save draft code for this question (resume later)
    if (typeof code === "string") {
      if (!attempt.savedCode) {
        attempt.savedCode = new Map();
      }
      attempt.savedCode.set(questionIdStr, code);
    }

    // Draft-only save (no submit) — do not change score/status
    if (typeof flag !== "boolean") {
      await attempt.save();
      return JsonOne(res, 200, "Code saved successfully", true);
    }

    const isCorrect = attempt.correctQuestionIds.some(id => id.toString() === questionIdStr);
    const isWrong = attempt.wrongQuestionIds.some(id => id.toString() === questionIdStr);
    const isRemaining = attempt.remainingQuestionIds.some(id => id.toString() === questionIdStr);

    // Track submission count for this question
    if (typeof submissionCount === 'number') {
      attempt.questionSubmissionCounts.set(questionIdStr, submissionCount);
    }

    if (flag) {
      // If correct - remove from remaining, add to correct (if not already), remove from wrong if there
      attempt.remainingQuestionIds = attempt.remainingQuestionIds.filter(
        id => id.toString() !== questionIdStr
      );
      if (!isCorrect) {
        attempt.correctQuestionIds.push(questionId);
        attempt.score += 10;
      }
      // Remove from wrong array if it was previously marked as wrong
      if (isWrong) {
        attempt.wrongQuestionIds = attempt.wrongQuestionIds.filter(
          id => id.toString() !== questionIdStr
        );
      }
    } else {
      // If wrong - add back to remaining (if not already), add to wrong (if not already)
      // If question was previously correct, remove it from correct array
      if (isCorrect) {
        attempt.correctQuestionIds = attempt.correctQuestionIds.filter(
          id => id.toString() !== questionIdStr
        );
        attempt.score = Math.max(0, attempt.score - 10);
      }
      if (isRemaining && !isWrong) {
        attempt.wrongQuestionIds.push(questionId);
      } else if (!isRemaining) {
        attempt.remainingQuestionIds.push(new mongoose.Types.ObjectId(questionId));
        if (!isWrong) {
          attempt.wrongQuestionIds.push(questionId);
        }
      }
    }

    if (attempt.remainingQuestionIds.length === 0) {
      attempt.completedAt = new Date();
    }

    await attempt.save();
    JsonOne(res, 200, "Attempt updated successfully", true);
  } catch (err) {
    return handleError(res, "unexpected error occurred while updating test Attempt");
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      level = "All",
      languageFilter = "All",
    } = req.query as {
      search?: string;
      level?: string;
      languageFilter?: string;
    };

    const { skip, sort, page, limit } = getPaginationParams(req);

    const aggregation: any[] = [
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
    const matchStage: any = {
      $or: [
        { "testData.name": { $regex: search, $options: "i" } },
        { "testData.language": { $regex: search, $options: "i" } },
      ],
    };
    if (level !== "All") {
      matchStage["testData.level"] = level;
    }
    if (languageFilter && languageFilter !== "All") {
      matchStage["testData.language"] = languageFilter;
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

    const result = await TestAttempt.aggregate(aggregation);
    const data = result[0].data;
    const total = result[0].total[0]?.count || 0;

    JsonAll(
      res,
      200,
      "Test Attempts fetched successfully",
      data,
      total,
      page,
      limit
    );
  } catch {
    return handleError(res, "unexpected error occurred while fetching test attempts");
  }
};

// Get single test attempt by ID (to fetch existing questionSubmissionCounts)
const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const attempt = await TestAttempt.findById(id);
    if (!attempt) {
      return JsonOne(res, 404, "Test Attempt not found", false);
    }

    // Convert Maps to plain objects for JSON response
    const questionSubmissionCountsObj = Object.fromEntries(
      attempt.questionSubmissionCounts || []
    );
    const savedCodeObj = Object.fromEntries(attempt.savedCode || []);

    return JsonOne(res, 200, "Test Attempt fetched successfully", true, {
      _id: attempt._id,
      userId: attempt.userId,
      testId: attempt.testId,
      correctQuestionIds: attempt.correctQuestionIds,
      wrongQuestionIds: attempt.wrongQuestionIds,
      remainingQuestionIds: attempt.remainingQuestionIds,
      questionSubmissionCounts: questionSubmissionCountsObj,
      savedCode: savedCodeObj,
      score: attempt.score,
      completedAt: attempt.completedAt,
      createdAt: attempt.createdAt,
    });
  } catch (err) {
    return handleError(res, "unexpected error occurred while fetching test Attempt");
  }
};

export { create, update, getAll, getById };
