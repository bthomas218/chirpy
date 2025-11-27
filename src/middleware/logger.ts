import type { Request, Response, NextFunction } from "express";

const middlewareLogResponses = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on("finish", () => {
    const statusCode = res.statusCode;
    if (statusCode >= 400) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });
  next();
};

export default middlewareLogResponses;
