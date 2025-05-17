import Test from "../models/test";

import { responseFun, aggregateResponse } from "../utils/responseFun";

import { Request, Response } from "express";

const create = async (req: Request, res: Response) => {
  const { name, numOfQuestions, language, level } = req.body;

  try {
    const test = await Test.create({
      name,
      numOfQuestions,
      language,
      level,
    });
    if (!test) {
      return responseFun(res, 500, "Failed to create test", false);
    }

    await test.save();

    responseFun(res, 201, `${name} test created successfully  `, true);
  } catch (error) {
    responseFun(res, 500, "unexpected error occurred while sign up", false);
  }
};

//only keep sort by createdAt
const getAll = async (req: Request, res: Response) => {
  try {
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

    const matchStage: any = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { language: { $regex: search, $options: "i" } },
      ],
    };
    // Add level filter only if selected and not equal to ALL ( means consider all )
    if (level && level !== "All") {
      matchStage["level"] = level;
    }

    const aggregation: any[] = [
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
    const data = await Test.aggregate(aggregation);
    const total: number = await Test.countDocuments(matchStage);

    aggregateResponse(
      res,
      200,
      "Tests fetched successfully",
      data,
      total,
      parseInt(page),
      parseInt(limit)
    );
  } catch {
    responseFun(res, 500, "unexpected error occurred while sign up", false);
  }
};

export { create, getAll };
