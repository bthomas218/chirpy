import express from "express";
import type { Request, Response } from "express";
import { UnauthorizedError, NotFoundError } from "../utils/errorClasses.js";
import { refreshTokens, users } from "../db/schema.js";
import type { User } from "../db/schema.js";
import {
  makeJWT,
  verifyPassword,
  makeRefreshToken,
  getBearerToken,
} from "../services/auth.js";
import config from "../config.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { loginUser } from "../controllers/authController.js";

const authRouter = express.Router();
type UserResponse = Omit<User, "password"> & {
  token?: string;
  refreshToken?: string;
};

authRouter.post("/login", loginUser);

authRouter.post("/refresh", async (req: Request, res: Response) => {
  const refreshToken = getBearerToken(req);
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, refreshToken));

  if (result) {
    if (!result.revokedAt && result.expiresAt > new Date(Date.now())) {
      const token = makeJWT(result.userId, 3600, config.jwtSecret);
      res.status(200).json({ token: token });
      return;
    }
  }
  throw new UnauthorizedError("Unauthorized");
});

authRouter.post("/revoke", async (req: Request, res: Response) => {
  const refreshToken = getBearerToken(req);
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, refreshToken));
  res.status(204).send();
});

export default authRouter;
