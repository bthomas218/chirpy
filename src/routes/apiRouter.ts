import express from "express";
import type { Request, Response } from "express";
import { BadRequestError } from "../utils/errorClasses.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

const router = express.Router();
const PROFANITIES = ["kerfuffle", "sharbert", "fornax"];

router.get("/healthz", async (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});

const validatechirp = async (
  req: Request<{}, {}, { body: string }>,
  res: Response
) => {
  if (req.body.body.length <= 140) {
    const cleanedBody = req.body.body
      .split(" ")
      .map((word) => {
        if (PROFANITIES.includes(word.toLowerCase())) {
          return "****";
        }
        return word;
      })
      .join(" ");
    res.json({ cleanedBody: cleanedBody });
  } else {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }
};

router.post(
  "/users",
  async (req: Request<{}, {}, { email: string }>, res: Response) => {
    const result = await db
      .insert(users)
      .values({ email: req.body.email })
      .returning();
    res.status(201).json(result[0]);
  }
);

export default router;
