import express from "express";
import type { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../utils/errorClasses.js";
import { db } from "../db/index.js";
import { users, posts, refreshTokens } from "../db/schema.js";
import type { User, RefreshToken } from "../db/schema.js";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  makeJWT,
  getBearerToken,
  validateJWT,
  makeRefreshToken,
} from "../utils/auth.js";
import config from "../config.js";

const router = express.Router();
const PROFANITIES = ["kerfuffle", "sharbert", "fornax"];
type UserResponse = Omit<User, "password"> & {
  token?: string;
  refreshToken?: string;
};

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
    return cleanedBody;
  } else {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }
};

router.post(
  "/chirps",
  async (
    req: Request<{}, {}, { body: string; userId: string }>,
    res: Response
  ) => {
    const token = getBearerToken(req);
    const userID = validateJWT(token, config.jwtSecret);
    const cleanedBody = await validatechirp(req.body.body);
    const result = await db
      .insert(posts)
      .values({ body: cleanedBody, userId: userID })
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
