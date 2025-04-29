import { Response } from "express";

const responseFun = (
  res: Response,
  statusCode: number,
  message: string,
  success: boolean,
  isVerified?: boolean,
  token?: string
) => {
  const response: any = {
    message,
    success,
    statusCode,
    ...(isVerified !== undefined && { isVerified }),
    ...(token !== undefined && { token }),
  };

  res.status(statusCode).json(response);
};

export default responseFun;
