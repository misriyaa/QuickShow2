import express from "express";
import { addShow, bookSeats, getShowById, getShows } from "../controllers/movieShowController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/add", addShow);
router.get("/all", getShows);
router.post("/book",userAuth ,bookSeats);
// Add this to your router:
router.get("/:showId", getShowById); // ← missing

export default router;