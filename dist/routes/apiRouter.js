import express from "express";
const router = express.Router();
router.get("/healthz", (req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});
router.post("/validate_chirp", (req, res) => {
    if (req.body.body.length <= 140) {
        res.json({ valid: true });
    }
    else {
        res.status(400).json({ error: "Chirp is too long" });
    }
});
export default router;
