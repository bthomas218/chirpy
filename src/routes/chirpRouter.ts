import express from "express";
import {
  postChirp,
  getChirp,
  listChirps,
} from "../controllers/chirpController.js";
import extractTokenMiddleware from "../middleware/token.js";
import extractUserMiddleware from "../middleware/extractUserMiddleware.js";

const chirpRouter = express.Router();

chirpRouter.post(
  "/chirps",
  extractTokenMiddleware,
  extractUserMiddleware,
  postChirp
);

chirpRouter.get("/chirps", listChirps);

chirpRouter.get("/chirps/:id", getChirp);

export default chirpRouter;
