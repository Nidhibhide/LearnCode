import { Request, Response } from "express";
import { JsonOne } from "./responseFun";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";

export interface PaginationParams {
  skip: number;
  sort: 1 | -1;
  page: number;
  limit: number;
}

export const getPaginationParams = (req: Request): PaginationParams => {
  const {
    sortOrder = "desc",
    page = "1",
    limit = "5",
  } = req.query as {
    sortOrder?: "asc" | "desc";
    page?: string;
    limit?: string;
  };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = sortOrder === "asc" ? 1 : -1;

  return {
    skip,
    sort,
    page: parseInt(page),
    limit: parseInt(limit),
  };
};

export const buildAggregationPipeline = (
  matchStage: any,
  sort: 1 | -1,
  skip: number,
  limit: number,
  project: any
): any[] => {
  return [
    { $match: matchStage },
    { $sort: { createdAt: sort } },
    { $skip: skip },
    { $limit: limit },
    { $project: project },
  ];
};

export const handleError = (res: Response, message: string) => {
  return JsonOne(res, 500, message, false);
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const verifyToken = (token: string, secret: string): JwtPayload | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
};