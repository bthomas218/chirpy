import express from "express";
import type { Request, Response } from "express";

const router = express.Router();
const PROFANITIES = ["kerfuffle", "sharbert", "fornax"];

router.get("/healthz", async (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});

router.post(
  "/validate_chirp",
  async (req: Request<{}, {}, { body: string }>, res: Response) => {
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
    } else {
      throw new Error("Chirp is too long");
    }
  }
);

export default router;
