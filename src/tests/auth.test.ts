import { describe, it, expect, beforeAll } from "vitest";
import jwt from "jsonwebtoken";
import { makeJWT, validateJWT } from "../services/auth.js";
import { UnauthorizedError } from "../utils/errorClasses.js";

describe("JWT Authentication", () => {
  const userID1 = "1";
  const userID2 = "2";
  const secret = "notsosecret";
  const oneHour = 3600;
  let token1: string;
  let token2: string;
  let invalidtoken: string;

  beforeAll(() => {
    token1 = makeJWT(userID1, oneHour, secret);
    token2 = makeJWT(userID2, oneHour, secret);
    invalidtoken = makeJWT("-1", oneHour, "itriedtoguessthesecret");
  });

  it("should return 1", () => {
    const result = validateJWT(token1, secret);
    expect(result).toBe("1");
  });

  it("should return 2", () => {
    const result = validateJWT(token2, secret);
    expect(result).toBe("2");
  });

  it("should throw an error", () => {
    expect(() => validateJWT(invalidtoken, secret)).toThrowError(
      UnauthorizedError
    );
  });

  it("should include iss claim 'chirpy' when decoded", () => {
    const decoded = jwt.verify(token1, secret) as Record<string, unknown>;
    expect(decoded.iss).toBe("chirpy");
  });

  it("should throw UnauthorizedError when token is expired", () => {
    const expired = makeJWT("3", -100, secret); // exp is in the past
    expect(() => validateJWT(expired, secret)).toThrowError(UnauthorizedError);
  });

  it("should throw No user ID error when token has empty sub", () => {
    const emptySub = makeJWT("", oneHour, secret);
    // validateJWT throws UnauthorizedError; implementation wraps inner errors
    expect(() => validateJWT(emptySub, secret)).toThrowError(UnauthorizedError);
    try {
      validateJWT(emptySub, secret);
    } catch (err) {
      expect((err as Error).message).toBe("No user ID in token");
    }
  });

  it("should throw Invalid issuer when token iss is not chirpy", () => {
    const notChirpyToken = jwt.sign(
      {
        iss: "blurpy",
        sub: "4",
        iat: oneHour,
        exp: Math.floor(Date.now() / 1000) + oneHour,
      },
      secret
    );
    // validateJWT throws UnauthorizedError; implementation wraps inner errors
    expect(() => validateJWT(notChirpyToken, secret)).toThrowError(
      UnauthorizedError
    );
    try {
      validateJWT(notChirpyToken, secret);
    } catch (err) {
      expect((err as Error).message).toBe("Invalid issuer");
    }
  });

  it("should throw UnauthorizedError for non-jwt input", () => {
    expect(() => validateJWT("not-a-token", secret)).toThrowError(
      UnauthorizedError
    );
  });
});
