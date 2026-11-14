import mongoose from "mongoose";
import { Test, User, TestAttempt } from "../models";
import { JsonOne, JsonAll, generateQuestions, sendToUser, getPaginationParams, buildAggregationPipeline, handleError } from "../utils";
import { Request, Response } from "express";
import { TEST_LANGUAGES, TEST_LEVELS } from "../constants";


const previewQuestions = async (req: Request, res: Response) => {
  const { language, level, numOfQuestions } = req.body;

  try {
    const questions = await generateQuestions(language, level, numOfQuestions);
    return JsonOne(res, 200, "Questions generated successfully", true, questions);
  } catch (error) {
    console.error(error);
    return handleError(res, "unexpected error occurred while generating questions");
  }
};

const create = async (req: Request, res: Response) => {
  const { name, numOfQuestions, language, level, questions: previewQuestions } = req.body;

  try {
    let questions = previewQuestions;

    // Use reviewed preview questions when provided; otherwise generate (backward compatible)
    if (Array.isArray(previewQuestions) && previewQuestions.length > 0) {
      if (previewQuestions.length !== Number(numOfQuestions)) {
        return JsonOne(
          res,
          400,
          "Questions count must match No of Questions",
          false
        );
      }
      questions = previewQuestions;
    } else {
      questions = await generateQuestions(language, level, numOfQuestions);
    }

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
    console.error(error);
    return handleError(res, "unexpected error occurred while create test");
  }
};

//get all and unattempted tests
const getAll = async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      level = "All",
      languageFilter = "All",
      onlyUnattempted = "false",
      userId,
    } = req.query as {
      search?: string;
      level?: string;
      languageFilter?: string;
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

    if (languageFilter && languageFilter !== "All") {
      matchStage["language"] = languageFilter;
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
    const { name, language, level, questions } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return JsonOne(res, 400, "Invalid test ID", false);
    }

    const oldTest = await Test.findById(id);
    if (!oldTest || oldTest.isDeleted) {
      return JsonOne(res, 404, "Test not found", false);
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return JsonOne(res, 400, "At least one question is required", false);
    }

    const cleanedQuestions = questions.map(
      (q: {
        _id?: string;
        questionText: string;
        sampleInput?: string;
        expectedOutput: string;
      }) => ({
        ...(q._id ? { _id: q._id } : {}),
        questionText: String(q.questionText || "").trim(),
        sampleInput: String(q.sampleInput || "").trim(),
        expectedOutput: String(q.expectedOutput || "").trim(),
      })
    );

    const numOfQuestions = cleanedQuestions.length;
    const attemptCount = await TestAttempt.countDocuments({ testId: id });

    // No students started → update existing test
    if (attemptCount === 0) {
      try {
        const updatedTest = await Test.findByIdAndUpdate(
          id,
          {
            name,
            language,
            level,
            questions: cleanedQuestions,
            numOfQuestions,
          },
          { new: true, runValidators: true }
        );

        if (!updatedTest) {
          return JsonOne(res, 404, "Test not found", false);
        }

        return JsonOne(res, 200, "Test updated successfully", true, {
          versioned: false,
          test: updatedTest,
        });
      } catch (err: any) {
        if (err?.code === 11000) {
          return JsonOne(res, 400, "Test name already exists", false);
        }
        throw err;
      }
    }

    // Students already started → archive old, create new version (attempts stay on old id)
    const stamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    let archiveName = `${oldTest.name} (archived ${stamp})`;
    if (archiveName.length > 100) {
      archiveName = archiveName.slice(0, 100);
    }

    await Test.findByIdAndUpdate(id, {
      name: archiveName,
      isDeleted: true,
    });

    const versionQuestions = cleanedQuestions.map(
      (q: {
        questionText: string;
        sampleInput?: string;
        expectedOutput: string;
      }) => ({
        questionText: q.questionText,
        sampleInput: q.sampleInput || "",
        expectedOutput: q.expectedOutput,
      })
    );

    try {
      const newTest = await Test.create({
        name,
        language,
        level,
        questions: versionQuestions,
        numOfQuestions,
      });

      if (!newTest) {
        return JsonOne(res, 500, "Failed to create new test version", false);
      }

      const users = await User.find({ role: "student" });
      users.forEach((user) => {
        sendToUser(user._id.toString(), {
          type: "info",
          message: `Test '${name}' was updated. A new version is available.`,
          title: "Test Updated",
        });
      });

      return JsonOne(
        res,
        201,
        "New test version created (students already started)",
        true,
        {
          versioned: true,
          test: newTest,
        }
      );
    } catch (err: any) {
      // Roll back archive if create failed
      await Test.findByIdAndUpdate(id, {
        name: oldTest.name,
        isDeleted: false,
      });
      if (err?.code === 11000) {
        return JsonOne(res, 400, "Test name already exists", false);
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    return handleError(res, "unexpected error occurred while updating test");
  }
};

const getDeletedAll = async (req: Request, res: Response) => {
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

    if (languageFilter && languageFilter !== "All") {
      matchStage["language"] = languageFilter;
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
      languageFilter = "All",
      onlyOnGoing = "false",
    } = req.query as {
      search?: string;
      level?: string;
      languageFilter?: string;
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

    if (languageFilter && languageFilter !== "All") {
      matchStage["test.language"] = languageFilter;
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
              attemptId: "$_id",
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
export { previewQuestions, create, getAll, softDelete, restore, edit, getDeletedAll, getOngoing };
