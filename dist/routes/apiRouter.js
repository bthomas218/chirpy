import express from "express";
import { BadRequestError } from "../utils/errorClasses.js";
const router = express.Router();
const PROFANITIES = ["kerfuffle", "sharbert", "fornax"];
router.get("/healthz", async (req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});
router.post("/validate_chirp", async (req, res) => {
    if (req.body.body.length <= 140) {
        const cleanedBody = req.body.body
            .split(" ")
            .map((word) => {
            if (PROFANITIES.includes(word.toLowerCase())) {
                return "****";
            }
            return word;
        })
            .join(" ");
        res.json({ cleanedBody: cleanedBody });
    }
    else {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
});
export default router;
