import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUSerData } from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.get("/data", userAuth, getUSerData);
export default userRouter;
