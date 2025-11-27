import type { Request, Response, NextFunction } from "express";

const errorHandlingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.message);
  res.status(500).json({ error: "Something went wrong on our end" });
};

export default errorHandlingMiddleware;
