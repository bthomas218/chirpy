//TODO: make auth services
import { NotFoundError, UnauthorizedError } from "../utils/errorClasses.js";
import { getUserByEmail } from "../db/queries/users.js";
import { makeJWT, makeRefreshToken, verifyPassword } from "../utils/auth.js";
import config from "../config.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";
import { User } from "../db/schema.js";

const ONE_HOUR = 3600; // In seconds
const SIXTY_DAYS = 1000 * 60 * 60 * 24 * 60; // In miliseconds

/**
 * Logins in a user
 * @param email Email of the user to login
 * @param password Password of the user to login
 * @returns User info except for their password plus their refresh token and acess token
 */
export async function loginUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) throw new NotFoundError("User Not Found");

  const isValidPassword = verifyPassword(password, user.password);
  if (!isValidPassword)
    throw new UnauthorizedError("Invalid Username or Password");

  const token = makeJWT(user.id, ONE_HOUR, config.jwtSecret);
  const refreshToken = makeRefreshToken();

  await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + SIXTY_DAYS),
  });

  const userResponse = user as Omit<User, "password">;
  return { user: userResponse, token, refreshToken };
}
