import type { Request, Response, NextFunction } from "express";
import config from "../config.js";

const middlewareMetricsInc = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.fileserverHits++;
  next();
};
export default middlewareMetricsInc;
