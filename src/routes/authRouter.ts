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
} from "../utils/auth.js";
import config from "../config.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { loginUser, refreshUser } from "../controllers/authController.js";
import extractTokenMiddleware from "../middleware/token.js";

const authRouter = express.Router();
type UserResponse = Omit<User, "password"> & {
  token?: string;
  refreshToken?: string;
};

authRouter.post("/login", loginUser);

authRouter.post("/refresh", extractTokenMiddleware, refreshUser);

authRouter.post("/revoke", async (req: Request, res: Response) => {
  const refreshToken = getBearerToken(req);
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, refreshToken));
  res.status(204).send();
});

export default authRouter;
