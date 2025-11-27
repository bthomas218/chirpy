import type { Request, Response, NextFunction } from "express";
import { APIError } from "../utils/errorClasses.js";

const errorHandlingMiddleware = (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.statusCode === 500) {
    console.error(err.message);
  }
  res.status(err.statusCode).json({
    error:
      err.statusCode === 500 ? "Something went wrong on our end" : err.message,
  });
};

export default errorHandlingMiddleware;
