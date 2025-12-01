import express from "express";
import type { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../utils/errorClasses.js";
import { db } from "../db/index.js";
import { users, posts, refreshTokens } from "../db/schema.js";
import type { User, RefreshToken } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

router.get("/healthz", async (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});

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
