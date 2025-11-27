import express from "express";
import type { Request, Response } from "express";
import middlewareLogResponses from "./middleware/logger.js";
import middlewareMetricsInc from "./middleware/metrics.js";
import { default as apiRouter } from "./routes/apiRouter.js";

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.use("/api", apiRouter);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);
