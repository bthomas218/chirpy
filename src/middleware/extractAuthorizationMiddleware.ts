import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/errorClasses.js";

/**
 * Extracts info like tokens and api keys from authorization header
 * @param req The request object now with the token attached
 * @param res The response object
 * @param next The next function
 */
const extractAuthorizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) throw new UnauthorizedError("Unauthorized");

  req.auth = authHeader.replace(/Bearer|ApiKey/, "").trim();
  console.log(req.auth);
  next();
};

export default extractAuthorizationMiddleware;
