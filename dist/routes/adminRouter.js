import express from "express";
import config from "../config.js";
import { ForbiddenError } from "../utils/errorClasses.js";
import { db } from "../db/index.js";
import { sql } from "drizzle-orm";
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
    if (config.platform !== "dev") {
        throw new ForbiddenError("Forbidden"); // dangerous enpoint can only be acessed in a development enviroment
    }
    config.fileserverHits = 0;
    const query = sql.raw(`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`);
    await db.execute(query);
    res
        .set("Content-Type", "text/plain; charset=utf-8")
        .send("Fileserver hits counter reset and users deleted.");
});
export default router;
