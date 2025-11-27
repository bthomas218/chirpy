import express from "express";
import type { Request, Response } from "express";
import middlewareLogResponses from "./middleware/logger.js";

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/healthz", (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});
