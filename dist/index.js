import express from "express";
import middlewareLogResponses from "./middleware/logger.js";
import middlewareMetricsInc from "./middleware/metrics.js";
import config from "./config.js";
const app = express();
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);
app.get("/healthz", (req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});
app.get("/metrics", (req, res) => {
    res
        .set("Content-Type", "text/plain; charset=utf-8")
        .send(`Hits: ${config.fileserverHits}`);
});
app.get("/reset", (req, res) => {
    config.fileserverHits = 0;
    res
        .set("Content-Type", "text/plain; charset=utf-8")
        .send("Fileserver hits counter reset.");
});
