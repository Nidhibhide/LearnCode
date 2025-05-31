//create test attempt
import TestAttempt from "../models/testAttempt";
import { JsonOne, JsonAll } from "../utils/responseFun";
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

    await test.save();

    JsonOne(res, 201, "Test attempt created successfully", true);
  } catch (error) {
    JsonOne(
      res,
      500,
      "unexpected error occurred while create test Attempt",
      false
    );
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { questionId, flag } = req.body;
    const { id } = req.params; //attempt id

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
    if (attempt?.remainingQuestionIds.length === 0) {
      attempt.completedAt = new Date();
    }
    await attempt.save();
    JsonOne(res, 201, "Attempt updated successfully", true);
  } catch (err) {
    JsonOne(
      res,
      500,
      "unexpected error occurred while updating test Attempt",
      false
    );
  }
};

export { create, update };
