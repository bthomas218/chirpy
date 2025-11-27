import express from "express";
const router = express.Router();
router.get("/healthz", (req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});
router.post("/validate_chirp", (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => {
        try {
            const parsedBody = JSON.parse(body);
            if (parsedBody.body.length <= 140) {
                res.status(200).send({ valid: true });
            }
            else {
                res.status(400).json({ error: "Chirp is too long" });
            }
        }
        catch {
            res.status(400).json({ error: "Invalid JSON" });
        }
    });
});
export default router;
