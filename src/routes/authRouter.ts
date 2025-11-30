import express from "express";
import {
  loginUser,
  refreshUser,
  revokeToken,
} from "../controllers/authController.js";
import extractTokenMiddleware from "../middleware/token.js";

const authRouter = express.Router();

authRouter.post("/login", loginUser);

authRouter.post("/refresh", extractTokenMiddleware, refreshUser);

authRouter.post("/revoke", extractTokenMiddleware, revokeToken);

export default authRouter;
