// routes/bookingRoutes.js
import express from "express";
import { bookSeats, getAllBookings, getMyBookings } from "../controllers/movieShowController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();
router.post("/book", userAuth, bookSeats);
router.get("/my", userAuth, getMyBookings);
router.get("/all", getAllBookings); // ← this was missing

export default router;