import express from "express";
import type { Request, Response } from "express";
import config from "../config.js";

const router = express.Router();

router.get("/healthz", (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});

router.get("/metrics", (req: Request, res: Response) => {
  res
    .set("Content-Type", "text/plain; charset=utf-8")
    .send(`Hits: ${config.fileserverHits}`);
});

router.get("/reset", (req: Request, res: Response) => {
  config.fileserverHits = 0;
  res
    .set("Content-Type", "text/plain; charset=utf-8")
    .send("Fileserver hits counter reset.");
});

export default router;
