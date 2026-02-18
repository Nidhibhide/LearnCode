import mongoose from "mongoose";
import { Test, User, TestAttempt } from "../models";
import { JsonOne, JsonAll, generateQuestions, sendToUser, getPaginationParams, buildAggregationPipeline, handleError } from "../utils";
import { Request, Response } from "express";


const create = async (req: Request, res: Response) => {
  const { name, numOfQuestions, language, level } = req.body;

  try {
    const questions = await generateQuestions(language, level, numOfQuestions);
    const test = await Test.create({
      name,
      numOfQuestions,
      language,
      level,
      questions,
    });

    if (!test) {
      return JsonOne(res, 500, "Failed to create test", false);
    }

    const users = await User.find({ role: "student" });
    users.forEach((user) => {
      sendToUser(user._id.toString(), {
        type: "info",
        message: `A new test titled '${test.name}' has been created.`,
        title: "New Test Available",
      });
    });

    JsonOne(res, 201, `${name} created successfully  `, true);
  } catch (error) {
    return handleError(res, "unexpected error occurred while create test");
  }
};

//get all and unattempted tests
const getAll = async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      level = "All",
      onlyUnattempted = "false",
      userId,
    } = req.query as {
      search?: string;
      level?: string;
      onlyUnattempted?: string;
      userId?: string;
    };

    const { skip, sort, page, limit } = getPaginationParams(req);

    const matchStage: any = {
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
      const attempts = await TestAttempt.find({ userId }).select("testId");
      const attemptedIds = attempts.map((a) => a.testId);
      matchStage["_id"] = { $nin: attemptedIds };
    }

    const aggregation = buildAggregationPipeline(matchStage, sort, skip, limit, {
      name: 1,
      language: 1,
      level: 1,
      numOfQuestions: 1,
      questions: 1,
      createdAt: 1,
    });
    const data = await Test.aggregate(aggregation);
    const total: number = await Test.countDocuments(matchStage);

    JsonAll(
      res,
      200,
      "Tests fetched successfully",
      data,
      total,
      page,
      limit
    );
  } catch {
    return handleError(res, "unexpected error occurred while fetching tests");
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
    return handleError(res, "unexpected error occurred while delete test");
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
    console.error("Soft restore error:", error);
    return handleError(res, "unexpected error occurred while restore test");
  }
};

const edit = async (req: Request, res: Response) => {
  try {
    const { name, numOfQuestions, language, level } = req.body;
    const { id } = req.params;
    const oldTest = await Test.findById(id);
    if (!oldTest) {
      return JsonOne(res, 404, "Old Test not found", false);
    }

    const shouldUpdateQuestions =
      oldTest.language !== language ||
      oldTest.level !== level ||
      oldTest.numOfQuestions !== numOfQuestions;

    const updatedFields: any = { name, numOfQuestions, language, level };

    if (shouldUpdateQuestions) {
      const newQuestions = await generateQuestions(
        language,
        level,
        numOfQuestions
      );
      updatedFields.questions = newQuestions;
    }

    const updatedTest = await Test.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedTest) {
      return JsonOne(res, 404, "Test not found", false);
    }

    JsonOne(res, 200, "test updated successfully", true);
  } catch (err) {
    return handleError(res, "unexpected error occurred while updating test");
  }
};

const getDeletedAll = async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      level = "All",
    } = req.query as {
      search?: string;
      level?: string;
    };

    const { skip, sort, page, limit } = getPaginationParams(req);

    const matchStage: any = {
      isDeleted: true,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { language: { $regex: search, $options: "i" } },
      ],
    };

    if (level && level !== "All") {
      matchStage["level"] = level;
    }

    const aggregation = buildAggregationPipeline(matchStage, sort, skip, limit, {
      name: 1,
      language: 1,
      level: 1,
      numOfQuestions: 1,
      createdAt: 1,
    });
    const data = await Test.aggregate(aggregation);
    const total: number = await Test.countDocuments(matchStage);

    JsonAll(
      res,
      200,
      "Deleted Tests fetched successfully",
      data,
      total,
      page,
      limit
    );
  } catch {
    return handleError(res, "unexpected error occurred while fetching deleted tests");
  }
};

//get completed test attempts and on going test attempts
const getOngoing = async (req: Request, res: Response) => {
  try {
    const { user } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(user);

    const {
      search = "",
      level = "All",
      onlyOnGoing = "false",
    } = req.query as {
      search?: string;
      level?: string;
      onlyOnGoing?: string;
    };

    const { skip, sort, page, limit } = getPaginationParams(req);

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

    if (onlyOnGoing === "true") {
      matchStage.completedAt = null;
    } else if (onlyOnGoing === "false") {
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

    const result = await TestAttempt.aggregate(aggregation);
    const data = result[0].data;
    const total = result[0].total[0]?.count || 0;

    JsonAll(
      res,
      200,
      "Attempted Tests fetched successfully",
      data,
      total,
      page,
      limit
    );
  } catch (error) {
    return handleError(res, "Unexpected error occurred while fetching attempted tests");
  }
};
export { create, getAll, softDelete, restore, edit, getDeletedAll, getOngoing };
