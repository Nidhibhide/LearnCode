import { userRegisterValidation, LoginValidation } from "../../validation/user";
import { Request, Response, NextFunction } from "express";
import responseFun from "../../utils/responseFun";

const userRegisterMid = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userRegisterValidation.validate(req.body);

  if (error) {
    const message = error.details[0].message;
    return responseFun(res, 400, message, false);
  }
  next();
};

const LoginValidtorMid = (req: Request, res: Response, next: NextFunction) => {
  const { error } = LoginValidation.validate(req.body);

  if (error) {
    const message = error.details[0].message;
    return responseFun(res, 400, message, false);
  }
  next();
};

export { userRegisterMid, LoginValidtorMid };
