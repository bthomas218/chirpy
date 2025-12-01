import express from "express";
import {
  postChirp,
  getChirp,
  listChirps,
  deleteChirp,
} from "../controllers/chirpController.js";
import extractAuthorizationMiddleware from "../middleware/extractAuthorizationMiddleware.js";
import extractUserMiddleware from "../middleware/extractUserMiddleware.js";

const chirpRouter = express.Router();

chirpRouter.get("/", listChirps);

chirpRouter.get("/:id", getChirp);

// Access tokens should be sent along these routes
chirpRouter.post(
  "/",
  extractAuthorizationMiddleware,
  extractUserMiddleware,
  postChirp
);
chirpRouter.delete(
  "/:id",
  extractAuthorizationMiddleware,
  extractUserMiddleware,
  deleteChirp
);

export default chirpRouter;
