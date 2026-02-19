import { JsonOne } from "../utils/responseFun";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import { InferSchemaType } from "mongoose";

type User = InferSchemaType<typeof User.schema>;

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
const IsLoggeedIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const access_token = req.cookies?.access_token;

    if (!access_token) {
      return JsonOne(res, 400, "Token not found", false);
    }

    const decode = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;
    const userID = decode.id;
    const user = await User.findById(userID).select(
      "name  email   role   isVerified createdAt isBlocked lastLogin dob"
    );

    if (!user) {
      return JsonOne(res, 404, "User not found", false);
    }
    req.user = user;

    next();
  } catch (error) {
    return JsonOne(res, 400, "Invalid or expired  Access Token", false);
  }
};

export default IsLoggeedIn;
