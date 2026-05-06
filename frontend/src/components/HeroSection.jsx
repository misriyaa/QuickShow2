import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const [latestMovie, setLatestMovie] = useState(null);

  useEffect(() => {
    axios.get("/api/movies/all").then((res) => {
      if (res.data.success && res.data.movies.length > 0) {
        setLatestMovie(res.data.movies[0]); // latest movie
      }
    });
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* 🎬 FULL POSTER BACKGROUND */}
      {latestMovie && (
        <img
          src={latestMovie.posterUrl}
          alt={latestMovie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* ⚠️ IMPORTANT: dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-16 lg:px-32 max-w-3xl gap-5">

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-yellow-400 fill-yellow-400"
            />
          ))}
          <span className="text-gray-300 text-sm ml-2">
            {latestMovie?.rating || "8.5"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          {latestMovie?.title}
        </h1>

        {/* Year */}
        <p className="text-gray-400 text-sm">
          {latestMovie?.year}
        </p>

        {/* Description */}
        <p className="text-gray-300 max-w-lg text-sm md:text-base">
          {latestMovie?.overview || "Watch the latest blockbuster now!"}
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => navigate("/movies")}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full text-white flex items-center gap-2"
          >
            Explore Movies
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate("/movies")}
            className="border border-white/30 px-6 py-3 rounded-full text-white"
          >
            Watch Trailer
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;