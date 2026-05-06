import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    language: { type: String, required: true },
    year: { type: String, required: true },
    title: { type: String, required: true },
    rating: { type: String },
    runtime: { type: String },

    // 🔥 FIXED: genres should be array
    genres: [{ type: String }],

    tagline: { type: String },
    overview: { type: String },
    posterUrl: { type: String },
    trailerUrl: { type: String },

    cast: [
      {
        name: String,
        photoUrl: String,
      },
    ],
  },
  { timestamps: true }
);

export const movieModel =mongoose.model("movie", movieSchema);