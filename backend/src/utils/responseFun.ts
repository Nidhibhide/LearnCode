import { Response } from "express";

const responseFun = (
  res: Response,
  statusCode: number,
  message: string,
  success: boolean,
  data?: Object
) => {
  const response: any = {
    message,
    success,
    statusCode,
    data,
  };

  res.status(statusCode).json(response);
};

const aggregateResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any[],
  total: number,
  page: number,
  limit: number
) => {
  const response = {
    success: true,
    statusCode,
    message,
    data,
    total,
    page,
    limit,
  };

  res.status(statusCode).json(response);
};

export { responseFun, aggregateResponse };
