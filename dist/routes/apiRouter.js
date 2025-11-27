import express from "express";
import { BadRequestError } from "../utils/errorClasses.js";
import { db } from "../db/index.js";
import { users, posts } from "../db/schema.js";
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
        return body;
    }
    else {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
};
router.post("/users", async (req, res) => {
    const result = await db
        .insert(users)
        .values({ email: req.body.email })
        .returning();
    res.status(201).json(result[0]);
});
router.post("/chirps", async (req, res) => {
    const cleanedBody = await validatechirp(req.body.body);
    const result = await db
        .insert(posts)
        .values({ body: cleanedBody, userId: req.body.userId })
        .returning();
    res.status(201).json(result[0]);
});
router.get("/chirps", async (req, res) => {
    const result = await db.query.posts.findMany({
        orderBy: (posts, { asc }) => [asc(posts.createdAt)],
    });
    res.json(result);
});
export default router;
