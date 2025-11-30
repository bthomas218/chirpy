import { NotFoundError, UnauthorizedError } from "../utils/errorClasses.js";
import { getUserByEmail } from "../db/queries/users.js";
import { makeJWT, makeRefreshToken, verifyPassword } from "../utils/auth.js";
import config from "../config.js";
import {
  createRefreshToken,
  getRefreshToken,
  revokeTokenInDb,
} from "../db/queries/refreshTokens.js";
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

/**
 * Uses a refresh token to get a new acess token
 * @param token possibly valid refresh token
 * @returns a new JWT that expires in one hour
 */
export async function getAcessToken(token: string) {
  const refreshToken = await getRefreshToken(token);

  if (!refreshToken) throw new UnauthorizedError("Unauthorized");
  if (refreshToken.revokedAt || refreshToken.expiresAt < new Date())
    throw new UnauthorizedError("Unathorized");
  return makeJWT(refreshToken.userId, ONE_HOUR, config.jwtSecret);
}

export async function revokeUserToken(token: string) {
  await revokeTokenInDb(token);
}
