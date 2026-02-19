import mongoose, { Types } from "mongoose";
import { Notification } from "../models";
import {
  JsonOne,
  JsonAll,
  getPaginationParams,
  buildAggregationPipeline,
  handleError,
} from "../utils";
import { io } from "../utils/notification";

import { Request, Response } from "express";

export const getAllByUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ObjectId = new mongoose.Types.ObjectId(id);

    const { search = "", type = "All" } = req.query as {
      search?: string;
      type?: string;
    };

    const { skip, sort, page, limit } = getPaginationParams(req);

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

    const aggregation = buildAggregationPipeline(
      matchStage,
      sort,
      skip,
      limit,
      {
        message: 1,
        type: 1,
        title: 1,
        read: 1,
        createdAt: 1,
      },
    );

    const data = await Notification.aggregate(aggregation);
    const total = await Notification.countDocuments(matchStage);

    JsonAll(
      res,
      200,
      "Notifications fetched successfully",
      data,
      total,
      page,
      limit,
    );
  } catch (error) {
    console.error(error);
    return handleError(
      res,
      "Unexpected error occurred while fetching notifications",
    );
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { id, profileChange } = req.query as {
      id?: string;
      profileChange?: string;
    };

    let notification;

    // If profileChange is true, find notification by userId and title "Complete Your Profile"
    if (profileChange === "true") {
      notification = await Notification.findOne({
        userId,
        title: "Complete Your Profile",
        read: false,
      });
    } else if (id) {
      // Find by notification id
      notification = await Notification.findById(id);
    } else {
      return JsonOne(
        res,
        400,
        "Either notification ID or profileChange=true is required",
        false,
      );
    }

    if (!notification) {
      return JsonOne(res, 404, "Notification not found", false);
    }

    // Mark notification as read
    notification.read = true;
    const updated = await notification.save();

    return JsonOne(res, 200, "Notification marked as read", true, updated);
  } catch (error) {
    console.error(error);
    return handleError(res, "Error updating notification");
  }
};
