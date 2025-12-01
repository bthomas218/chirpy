import express from "express";
import {
  postChirp,
  getChirp,
  listChirps,
  deleteChirp,
} from "../controllers/chirpController.js";
import extractTokenMiddleware from "../middleware/token.js";
import extractUserMiddleware from "../middleware/extractUserMiddleware.js";

const chirpRouter = express.Router();

chirpRouter.get("/", listChirps);

chirpRouter.get("/:id", getChirp);

// Access tokens should be sent along these routes
chirpRouter.post("/", extractTokenMiddleware, extractUserMiddleware, postChirp);
chirpRouter.delete(
  "/:id",
  extractTokenMiddleware,
  extractUserMiddleware,
  deleteChirp
);

export default chirpRouter;
