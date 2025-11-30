import express from "express";
import { refreshTokens } from "../db/schema.js";
import { getBearerToken, } from "../utils/auth.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { loginUser, refreshUser } from "../controllers/authController.js";
import extractTokenMiddleware from "../middleware/token.js";
const authRouter = express.Router();
authRouter.post("/login", loginUser);
authRouter.post("/refresh", extractTokenMiddleware, refreshUser);
authRouter.post("/revoke", async (req, res) => {
    const refreshToken = getBearerToken(req);
    await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.token, refreshToken));
    res.status(204).send();
});
export default authRouter;
