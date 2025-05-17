import { Request, Response, NextFunction } from "express";
import {responseFun} from "../../utils/responseFun";
import { createTestValidation } from "../../validation/test";

const testCreateMid = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createTestValidation.validate(req.body);

  if (error) {
    const message = error.details[0].message;
    return responseFun(res, 400, message, false);
  }
  next();
};

export { testCreateMid };
