import express from "express";
import config from "../config.js";
const router = express.Router();
router.get("/metrics", async (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8").send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
});
router.post("/reset", async (req, res) => {
    config.fileserverHits = 0;
    res
        .set("Content-Type", "text/plain; charset=utf-8")
        .send("Fileserver hits counter reset.");
});
export default router;
