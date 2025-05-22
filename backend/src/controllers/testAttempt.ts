import { JsonOne, JsonAll } from "../utils/responseFun";

import { Request, Response } from "express";
import TestAttempt from "../models/testAttempt";
import mongoose from "mongoose";

const getAttempted = async (req: Request, res: Response) => {
  try {
    const { user } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(user);

    const {
      search = "",
      sortOrder = "desc",
      page = "1",
      limit = "5",
      level = "All",
    } = req.query as {
      search?: string;
      sortOrder?: "asc" | "desc";
      page?: string;
      limit?: string;
      level?: string;
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = sortOrder === "asc" ? 1 : -1;

    const aggregation: any[] = [
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

    const matchStage: any = {
      $or: [
        { "test.name": { $regex: search, $options: "i" } },
        { "test.language": { $regex: search, $options: "i" } },
      ],
    };

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
              score: 1,
              completedAt: 1,
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
      "Attempted Tests fetched successfully",
      data,
      total,
      parseInt(page),
      parseInt(limit)
    );
  } catch (error) {
    JsonOne(
      res,
      500,
      "Unexpected error occurred while fetching attempted tests",
      false
    );
  }
};

export { getAttempted };
