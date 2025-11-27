import express from "express";
const router = express.Router();
router.get("/healthz", (req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});
export default router;
