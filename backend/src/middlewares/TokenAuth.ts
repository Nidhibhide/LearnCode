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
    const token = req.cookies?.token;

    if (!token) {
      return JsonOne(res, 400, "Token not found", false);
    }

    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;
    const userID = decode.id;
    const user = await User.findById(userID).select(
      "name  email   role   isVerified createdAt "
    );

    if (!user) {
      return JsonOne(res, 404, "User not found", false);
    }
    req.user = user;

    next();
  } catch (error) {
    return JsonOne(res, 400, "Invalid or expired Token", false);
  }
};

export default IsLoggeedIn;
