import express from "express";
import type { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../utils/errorClasses.js";
import { db } from "../db/index.js";
import { users, posts } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { resourceLimits } from "worker_threads";
import { resourceUsage } from "process";

const router = express.Router();
const PROFANITIES = ["kerfuffle", "sharbert", "fornax"];

router.get("/healthz", async (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});

const validatechirp = async (body: string) => {
  if (body.length <= 140) {
    const cleanedBody = body
      .split(" ")
      .map((word) => {
        if (PROFANITIES.includes(word.toLowerCase())) {
          return "****";
        }
        return word;
      })
      .join(" ");
    return body;
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

router.post(
  "/chirps",
  async (
    req: Request<{}, {}, { body: string; userId: string }>,
    res: Response
  ) => {
    const cleanedBody = await validatechirp(req.body.body);
    const result = await db
      .insert(posts)
      .values({ body: cleanedBody, userId: req.body.userId })
      .returning();
    res.status(201).json(result[0]);
  }
);

router.get("/chirps", async (req: Request, res: Response) => {
  const result = await db.query.posts.findMany({
    orderBy: (posts, { asc }) => [asc(posts.createdAt)],
  });
  res.json(result);
});

router.get(
  "/chirps/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.id, req.params.id));

    if (result.length > 0) {
      res.json(result[0]);
    }
    throw new NotFoundError("Post Not Found");
  }
);

export default router;
