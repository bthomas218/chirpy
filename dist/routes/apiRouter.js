import express from "express";
import { BadRequestError, NotFoundError } from "../utils/errorClasses.js";
import { db } from "../db/index.js";
import { posts } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { getBearerToken, validateJWT, } from "../utils/auth.js";
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
