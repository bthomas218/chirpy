import express from "express";
import type { Request, Response } from "express";

const router = express.Router();

router.get("/healthz", async (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});

export default router;
