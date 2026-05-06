import React from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "lucide-react";
import { getImageUrl } from "../utilities/imageUrl";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const genres = Array.isArray(movie.genres)
    ? movie.genres
    : movie?.genres?.split(",") || [];

  return (
    <div className="bg-gray-900 p-3 rounded-xl">

      <img
        src={getImageUrl(movie.posterUrl)}
        className="h-60 w-full object-cover rounded-lg cursor-pointer"
        onClick={() => navigate(`/movies/${movie._id}`)}
      />

      <h3 className="mt-2 font-bold">{movie.title}</h3>

      <p className="text-sm text-gray-400">
        {movie.year} • {genres.slice(0, 2).join(", ")}
      </p>

      <div className="flex justify-between mt-3">
        <button
          onClick={() => navigate(`/movies/${movie._id}`)}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Book
        </button>

        <span className="flex items-center gap-1">
          <StarIcon size={16} />
          {movie.rating}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;