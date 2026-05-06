import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/data", userAuth, getDashboardData);

export default router;