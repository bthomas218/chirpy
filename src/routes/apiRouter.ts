import express from "express";
import type { Request, Response } from "express";
import chirpRouter from "./chirpRouter.js";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import { upgradeUser } from "../controllers/userController.js";

const apiRouter = express.Router();

apiRouter.get("/healthz", async (req: Request, res: Response) => {
  res.type("text/plain; charset=utf-8").send("OK");
});

apiRouter.post("/polka/webhooks", upgradeUser);

apiRouter.use("/chirps", chirpRouter);
apiRouter.use("/users", userRouter);
apiRouter.use(authRouter);

export default apiRouter;
