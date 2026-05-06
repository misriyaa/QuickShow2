import express from "express";
import {
    AddMovie,
  getAllMovies,
  getMovieById,
} from "../controllers/movieShowController.js";


const router = express.Router();

router.post("/add", AddMovie);
router.get("/all", getAllMovies);
router.get("/:id", getMovieById);

export default router;