import { Request, Response, NextFunction } from "express";
import {JsonOne} from "../../utils/responseFun"
import { TestValidation, PreviewQuestionsValidation, EditTestValidation } from "../../validation/test";

const TestValidMid = (req: Request, res: Response, next: NextFunction) => {
  const { error } = TestValidation.validate(req.body);

  if (error) {
    const message = error.details[0].message;
    return JsonOne(res, 400, message, false);
  }
  next();
};

const PreviewQuestionsValidMid = (req: Request, res: Response, next: NextFunction) => {
  const { error } = PreviewQuestionsValidation.validate(req.body);

  if (error) {
    const message = error.details[0].message;
    return JsonOne(res, 400, message, false);
  }
  next();
};

const EditTestValidMid = (req: Request, res: Response, next: NextFunction) => {
  const { error } = EditTestValidation.validate(req.body);

  if (error) {
    const message = error.details[0].message;
    return JsonOne(res, 400, message, false);
  }
  next();
};

export { TestValidMid, PreviewQuestionsValidMid, EditTestValidMid };
