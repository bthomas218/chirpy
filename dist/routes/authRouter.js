import express from "express";
import { UnauthorizedError, NotFoundError } from "../utils/errorClasses.js";
import { refreshTokens, users } from "../db/schema.js";
import { makeJWT, verifyPassword, makeRefreshToken, getBearerToken, } from "../services/auth.js";
import config from "../config.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
const authRouter = express.Router();
authRouter.post("/login", async (req, res) => {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, req.body.email));
    const user = result[0];
    if (user) {
        if (await verifyPassword(req.body.password, result[0].password)) {
            user.token = makeJWT(user.id, 3600, config.jwtSecret);
            user.refreshToken = makeRefreshToken();
            await db.insert(refreshTokens).values({
                userId: user.id,
                token: user.refreshToken,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // Expires in 60 days
            });
            res.status(200).json(user);
        }
        else {
            throw new UnauthorizedError("Invalid Username or Password");
        }
    }
    else {
        throw new NotFoundError("User not found");
    }
});
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
