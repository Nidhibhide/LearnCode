import { Request, Response, NextFunction } from "express";
import {JsonOne} from "../../utils/responseFun"
import { TestValidation } from "../../validation/test";

const TestValidMid = (req: Request, res: Response, next: NextFunction) => {
  const { error } = TestValidation.validate(req.body);

  if (error) {
    const message = error.details[0].message;
    return JsonOne(res, 400, message, false);
  }
  next();
};

export {  TestValidMid };
