//create test attempt
import { TestAttempt } from "../models";
import { JsonOne, JsonAll, getPaginationParams, buildAggregationPipeline, handleError } from "../utils";
import { Request, Response } from "express";
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

    JsonOne(res, 201, "Test attempt created successfully", true);
  } catch (error) {
    return handleError(res, "unexpected error occurred while create test Attempt");
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { questionId, flag } = req.body;
    const { id } = req.params;

    const attempt = await TestAttempt.findById(id);
    if (!attempt) {
      return JsonOne(res, 404, "Test Attempt not found", false);
    }

    attempt.remainingQuestionIds = attempt.remainingQuestionIds.filter(
      (id) => id.toString() !== questionId
    );

    if (flag) {
      if (!attempt.correctQuestionIds.includes(questionId)) {
        attempt.correctQuestionIds.push(questionId);
        attempt.score += 10;
      }
    } else {
      if (!attempt.wrongQuestionIds.includes(questionId)) {
        attempt.wrongQuestionIds.push(questionId);
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
    } = req.query as {
      search?: string;
      level?: string;
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
export { create, update, getAll };
