import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errorClasses.js";
import crypto from "node:crypto";
export async function hashPassword(password) {
    return await argon2.hash(password);
}
export async function verifyPassword(password, hash) {
    return await argon2.verify(hash, password);
}
/**
 * Makes a JWT for a user
 * @param userID The subject of the payload
 * @param expiresIn Time for token to expire in SECONDS
 * @param secret Secret signing key
 * @returns JWT with encoded information
 */
export function makeJWT(userID, expiresIn, secret) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const pl = {
        iss: "chirpy",
        sub: userID,
        iat: issuedAt,
        exp: issuedAt + expiresIn,
    };
    return jwt.sign(pl, secret);
}
export function validateJWT(tokenString, secret) {
    let decoded;
    try {
        decoded = jwt.verify(tokenString, secret);
    }
    catch (err) {
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
export function makeRefreshToken() {
    return crypto.randomBytes(32).toString("hex");
}
