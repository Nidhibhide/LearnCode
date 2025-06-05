import mongoose, { Types } from "mongoose";
import Notification from "../models/notification";
import { JsonOne, JsonAll } from "../utils/responseFun";

import { Request, Response } from "express";

export const getAllByUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ObjectId = new mongoose.Types.ObjectId(id);

    const {
      search = "",
      sortOrder = "desc",
      page = "1",
      limit = "5",
      type = "All",
    } = req.query as {
      search?: string;
      sortOrder?: "asc" | "desc";
      page?: string;
      limit?: string;
      type?: string;
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = sortOrder === "asc" ? 1 : -1;

    const matchStage: any = {
      userId: ObjectId, // match notifications for a specific user
      $or: [
        { message: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ],
    };

    if (type && type !== "All") {
      matchStage["type"] = type;
    }

    const aggregation: any[] = [
      { $match: matchStage },
      { $sort: { createdAt: sort } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $project: {
          message: 1,
          type: 1,
          title: 1,
          read: 1,
          createdAt: 1,
        },
      },
    ];

    const data = await Notification.aggregate(aggregation);
    const total = await Notification.countDocuments(matchStage);

    JsonAll(
      res,
      200,
      "Notifications fetched successfully",
      data,
      total,
      parseInt(page),
      parseInt(limit)
    );
  } catch (error) {
    console.error(error);
    JsonOne(
      res,
      500,
      "Unexpected error occurred while fetching notifications",
      false
    );
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updated = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!updated) {
      return JsonOne(res, 404, "Notification not found", false);
    }

    return JsonOne(res, 200, "Notification marked as read", true, updated);
  } catch (error) {
    console.error(error);
    return JsonOne(res, 500, "Error updating notification", false);
  }
};
