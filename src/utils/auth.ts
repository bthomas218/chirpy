import argon2 from "argon2";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errorClasses.js";
import type { Request } from "express";
import crypto from "node:crypto";

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await argon2.verify(hash, password);
}

/**
 * @property iss - Issuer: which should be "chirpy"
 * @property sub - Subject: which should be the user id
 * @property iat - Issued at: when the token was issued
 * @property exp - Expiration: when the token expires
 */
type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

/**
 * Makes a JWT for a user
 * @param userID The subject of the payload
 * @param expiresIn Time for token to expire in SECONDS
 * @param secret Secret signing key
 * @returns JWT with encoded information
 */
export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string
): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const pl: payload = {
    iss: "chirpy",
    sub: userID,
    iat: issuedAt,
    exp: issuedAt + expiresIn,
  };
  return jwt.sign(pl, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  let decoded: payload;
  try {
    decoded = jwt.verify(tokenString, secret) as payload;
  } catch (err) {
    throw new UnauthorizedError("Unauthorized");
  }

  if (!decoded.sub) {
    throw new UnauthorizedError("No user ID in token");
  }

  if (decoded.iss !== "chirpy") {
    throw new UnauthorizedError("Invalid issuer");
  }
  return decoded.sub;
}

/**
 * Extracts Bearer Token from a request
 * @param req Request object to get the token from
 * @returns the token
 */
export function getBearerToken(req: Request): string {
  const bearerToken = req.get("Authorization");
  if (!bearerToken) {
    throw new UnauthorizedError("Unauthorized");
  }
  return bearerToken.replace("Bearer", "").trim();
}

export function makeRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}
