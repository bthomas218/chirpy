import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/errorClasses.js";

const extractTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) throw new UnauthorizedError("Unauthorized");

  req.token = authHeader.replace("Bearer", "").trim();
  next();
};

export default extractTokenMiddleware;
