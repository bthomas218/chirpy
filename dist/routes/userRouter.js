import express from "express";
import { registerUser, updateUser } from "../controllers/userController.js";
import extractTokenMiddleware from "../middleware/token.js";
import extractUserMiddleware from "../middleware/extractUserMiddleware.js";
const userRouter = express.Router();
userRouter.post("/", registerUser);
// Expecting acess token in header
userRouter.put("/", extractTokenMiddleware, extractUserMiddleware, updateUser);
export default userRouter;
