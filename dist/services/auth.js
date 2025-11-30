import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errorClasses.js";
export async function hashPassword(password) {
    return await argon2.hash(password);
}
export async function verifyPassword(password, hash) {
    return await argon2.verify(hash, password);
}
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
/**
 * Extracts Bearer Token from a request
 * @param req Request object to get the token from
 * @returns the token
 */
export function getBearerToken(req) {
    const bearerToken = req.get("Authorization");
    if (!bearerToken) {
        throw new UnauthorizedError("Unauthorized");
    }
    return bearerToken.replace("Bearer", "").trim();
}
