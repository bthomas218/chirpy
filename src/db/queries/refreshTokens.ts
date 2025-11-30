import { db } from "../index.js";
import { refreshTokens, NewRefreshToken } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createRefreshToken(refreshToken: NewRefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .onConflictDoNothing()
    .returning();
  return result;
}
