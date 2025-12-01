import type { Request, Response, NextFunction } from "express";
import { APIError } from "../utils/errorClasses.js";
import e from "express";

const errorHandlingMiddleware = (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode ?? 500;
  if (statusCode === 500) {
    console.error(err.message);
  }
  res.status(statusCode).json({
    error: statusCode === 500 ? "Something went wrong on our end" : err.message,
  });
};

export default errorHandlingMiddleware;
