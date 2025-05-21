import { NextFunction, Request, Response } from "express";
import { JsonOne } from "../utils/responseFun";

const RoleAuth = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return JsonOne(res, 401, "Unauthorized: User not found", false);
    }
    if (!allowedRoles.includes(user?.role)) {
      return JsonOne(res, 403, "Forbidden: Access denied", false);
    }
    next();
  };
};

export default RoleAuth;
