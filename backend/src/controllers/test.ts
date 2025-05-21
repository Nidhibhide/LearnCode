import mongoose from "mongoose";
import Test from "../models/test";

import { JsonOne, JsonAll } from "../utils/responseFun";

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
      return JsonOne(res, 500, "Failed to create test", false);
    }

    await test.save();

    JsonOne(res, 201, `${name} test created successfully  `, true);
  } catch (error) {
    JsonOne(res, 500, "unexpected error occurred while sign up", false);
  }
};

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
      isDeleted: false,
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

    JsonAll(
      res,
      200,
      "Tests fetched successfully",
      data,
      total,
      parseInt(page),
      parseInt(limit)
    );
  } catch {
    JsonOne(res, 500, "unexpected error occurred while sign up", false);
  }
};

const softDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return JsonOne(res, 400, "Invalid test ID", false);
    }

    const deletedTest = await Test.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedTest) {
      return JsonOne(res, 404, "Test not found", false);
    }

    return JsonOne(res, 200, "Test deleted successfully", true);
  } catch (error) {
    console.error("Soft delete error:", error);

    JsonOne(res, 500, "unexpected error occurred while delete test", false);
  }
};
const restore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return JsonOne(res, 400, "Invalid test ID", false);
    }

    const deletedTest = await Test.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );

    if (!deletedTest) {
      return JsonOne(res, 404, "Test not found", false);
    }

    return JsonOne(res, 200, "Test restored successfully", true);
  } catch (error) {
    console.error("Soft delete error:", error);

    JsonOne(res, 500, "unexpected error occurred while restore test", false);
  }
};

const edit = async (req: Request, res: Response) => {
  try {
    const { name, numOfQuestions, language, level } = req.body;
    const { id } = req.params;

    const updatedTest = await Test.findByIdAndUpdate(
      id,
      { name, numOfQuestions, language, level },
      { new: true }
    );

    if (!updatedTest) {
      return JsonOne(res, 404, "Test not found", false);
    }
    JsonOne(res, 201, "test updated successfully", true);
  } catch (err) {
    JsonOne(res, 500, "unexpected error occurred while updating test", false);
  }
};

export { create, getAll, softDelete, restore,edit };
