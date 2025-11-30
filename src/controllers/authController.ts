// TODO: make auth controllers
import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";
import { User } from "../db/schema.js";
import {
  makeJWT,
  verifyPassword,
  makeRefreshToken,
  getBearerToken,
} from "../services/auth.js";
import { UnauthorizedError, NotFoundError } from "../utils/errorClasses.js";
import config from "../config.js";

type UserResponse = Omit<User, "password"> & {
  token?: string;
  refreshToken?: string;
};

export async function loginUser(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) {
  const user = await getUserByEmail(req.body.email);

  if (user) {
    if (await verifyPassword(req.body.password, user.password)) {
      const userResponse = user as UserResponse;
      userResponse.token = makeJWT(user.id, 3600, config.jwtSecret);
      userResponse.refreshToken = makeRefreshToken();

      createRefreshToken({
        userId: user.id,
        token: userResponse.refreshToken,
        expiresAt: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 60)),
      });

      res.status(200).json(userResponse);
    } else {
      throw new UnauthorizedError("Invalid Username or Password");
    }
  } else {
    throw new NotFoundError("User not found");
  }
}
