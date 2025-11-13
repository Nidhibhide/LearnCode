import { JsonOne } from "../utils/responseFun";
import { Request, Response, NextFunction } from "express";

const BlockCheck = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.isBlocked) {
    return JsonOne(res, 403, "Account is blocked due to multiple failed login attempts. Please reset your password.", false);
  }
  next();
};

export default BlockCheck;