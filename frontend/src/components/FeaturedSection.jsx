import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MovieCard from "./MovieCard";
import axios from "axios";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/movies/all");

      if (res.data.success) {
        setMovies(res.data.movies || []);
      }
    } catch (error) {
      console.log("Error fetching featured movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden bg-[#050505] pb-20">

      {/* HEADER */}
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <p className="text-gray-300 font-medium text-lg">Now Showing</p>

        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          View All
          <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
        </button>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-8">

          {/* SHOW ONLY FIRST 8 MOVIES */}
          {movies.slice(0, 8).map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}

        </div>
      ) : (
        <div className="text-gray-500">No movies found</div>
      )}

      {/* SHOW MORE */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => {
            navigate("/movies");
            window.scrollTo(0, 0);
          }}
          className="bg-[#FF4D67] hover:bg-[#ff3653] text-white px-10 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#FF4D67]/20"
        >
          Show more
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;