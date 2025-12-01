import express from "express";
import { registerUser, updateUser } from "../controllers/userController.js";
import extractAuthorizationMiddleware from "../middleware/extractAuthorizationMiddleware.js";
import extractUserMiddleware from "../middleware/extractUserMiddleware.js";
const userRouter = express.Router();
userRouter.post("/", registerUser);
// Expecting acess token in header
userRouter.put("/", extractAuthorizationMiddleware, extractUserMiddleware, updateUser);
export default userRouter;
