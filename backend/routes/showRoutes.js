import express from "express";
import { addShow, bookSeats, getShowById, getShows } from "../controllers/movieShowController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/add", addShow);
router.get("/all", getShows);
router.post("/book",userAuth ,bookSeats);
router.get("/:showId", getShowById); 

export default router;