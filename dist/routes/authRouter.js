import express from "express";
import { loginUser, refreshUser, revokeToken, } from "../controllers/authController.js";
import extractAuthorizationMiddleware from "../middleware/extractAuthorizationMiddleware.js";
const authRouter = express.Router();
authRouter.post("/login", loginUser);
authRouter.post("/refresh", extractAuthorizationMiddleware, refreshUser);
authRouter.post("/revoke", extractAuthorizationMiddleware, revokeToken);
export default authRouter;
