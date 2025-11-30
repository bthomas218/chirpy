import express from "express";
import { BadRequestError, NotFoundError, UnauthorizedError, } from "../utils/errorClasses.js";
import { db } from "../db/index.js";
import { users, posts, refreshTokens } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, makeJWT, getBearerToken, validateJWT, makeRefreshToken, } from "../services/auth.js";
import config from "../config.js";
const router = express.Router();
const PROFANITIES = ["kerfuffle", "sharbert", "fornax"];
router.get("/healthz", async (req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});
const validatechirp = async (body) => {
    if (body.length <= 140) {
        const cleanedBody = body
            .split(" ")
            .map((word) => {
            if (PROFANITIES.includes(word.toLowerCase())) {
                return "****";
            }
            return word;
        })
            .join(" ");
        return cleanedBody;
    }
    else {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
};
router.post("/users", async (req, res) => {
    const result = await db
        .insert(users)
        .values({
        email: req.body.email,
        password: await hashPassword(req.body.password),
    })
        .returning();
    res.status(201).json(result[0]);
});
router.post("/login", async (req, res) => {
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
router.post("/refresh", async (req, res) => {
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
router.post("/revoke", async (req, res) => {
    const refreshToken = getBearerToken(req);
    await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.token, refreshToken));
    res.status(204).send();
});
router.post("/chirps", async (req, res) => {
    const token = getBearerToken(req);
    const userID = validateJWT(token, config.jwtSecret);
    const cleanedBody = await validatechirp(req.body.body);
    const result = await db
        .insert(posts)
        .values({ body: cleanedBody, userId: userID })
        .returning();
    res.status(201).json(result[0]);
});
router.get("/chirps", async (req, res) => {
    const result = await db.query.posts.findMany({
        orderBy: (posts, { asc }) => [asc(posts.createdAt)],
    });
    res.json(result);
});
router.get("/chirps/:id", async (req, res) => {
    const result = await db
        .select()
        .from(posts)
        .where(eq(posts.id, req.params.id));
    if (result.length > 0) {
        res.json(result[0]);
    }
    throw new NotFoundError("Post Not Found");
});
export default router;
