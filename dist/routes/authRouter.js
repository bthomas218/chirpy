import express from "express";
import { UnauthorizedError } from "../utils/errorClasses.js";
import { refreshTokens } from "../db/schema.js";
import { makeJWT, getBearerToken, } from "../services/auth.js";
import config from "../config.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { loginUser } from "../controllers/authController.js";
const authRouter = express.Router();
authRouter.post("/login", loginUser);
authRouter.post("/refresh", async (req, res) => {
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
authRouter.post("/revoke", async (req, res) => {
    const refreshToken = getBearerToken(req);
    await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.token, refreshToken));
    res.status(204).send();
});
export default authRouter;
