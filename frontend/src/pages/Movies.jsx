import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movies/all`);

      if (res.data.success) {
        setMovies(res.data.movies);
      }
    } catch (error) {
      console.log("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        Loading movies...
      </div>
    );
  }

  return movies.length > 0 ? (
    <div className="relative pt-32 pb-20 px-6 md:px-16 lg:px-40 xl:px-44 min-h-screen bg-[#050505] text-white">
      
      <h1 className="text-lg font-medium my-4">Now Showing</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>

    </div>
  ) : (
    <div className="min-h-[80vh] bg-[#050505] flex items-center justify-center text-gray-500">
      <Loading/>
    </div>
  );
};

export default Movies;