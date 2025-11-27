import express from "express";
import type { Request, Response } from "express";
import { json } from "stream/consumers";

const router = express.Router();

router.get("/healthz", (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});

router.post("/validate_chirp", (req: Request, res: Response) => {
  type reqData = {
    body: string;
  };

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const parsedBody = JSON.parse(body) as reqData;
      if (parsedBody.body.length <= 140) {
        res.status(200).send({ valid: true });
      } else {
        res.status(400).json({ error: "Chirp is too long" });
      }
    } catch {
      res.status(400).json({ error: "Invalid JSON" });
    }
  });
});

export default router;
