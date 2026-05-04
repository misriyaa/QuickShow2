// routes/locationRoutes.js
import express from "express";
import { searchPlaces, getWorkshops } from "../controllers/locationController.js";

const router = express.Router();

router.get("/search", searchPlaces);
router.get("/workshops", getWorkshops);

export default router;