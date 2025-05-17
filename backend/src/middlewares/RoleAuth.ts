import { NextFunction, Request, Response } from "express";
import { responseFun } from "../utils/responseFun";

const RoleAuth = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return responseFun(res, 401, "Unauthorized: User not found", false);
    }
    if (!allowedRoles.includes(user?.role)) {
      return responseFun(res, 403, "Forbidden: Access denied", false);
    }
    next();
  };
};

export default RoleAuth;
