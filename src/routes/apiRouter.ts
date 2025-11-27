import express from "express";
import type { Request, Response } from "express";
import { json } from "stream/consumers";

const router = express.Router();

router.get("/healthz", (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});

router.post(
  "/validate_chirp",
  (req: Request<{}, {}, { body: string }>, res: Response) => {
    if (req.body.body.length <= 140) {
      res.json({ valid: true });
    } else {
      res.status(400).json({ error: "Chirp is too long" });
    }
  }
);

export default router;
