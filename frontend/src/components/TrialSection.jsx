import React, { useEffect, useState } from "react";
import axios from "axios";

const TrailersSection = () => {
  const [movies, setMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movies/all`)
    .then((res) => {
      if (res.data.success) {
        // Only keep movies that actually have a trailerUrl
        const withTrailers = res.data.movies.filter((m) => m.trailerUrl);
        setMovies(withTrailers);
        setCurrentMovie(withTrailers[0] || null);
      }
    }).finally(() => setLoading(false));
  }, []);

  // Convert any YouTube URL format → embed URL
  const toEmbedUrl = (url = "") => {
    if (!url) return "";
    // Already an embed URL
    if (url.includes("/embed/")) return url;
    // youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    // youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    return url;
  };

  if (loading) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 bg-[#050505]">
        <div className="max-w-[960px] mx-auto">
          <div className="h-5 w-24 bg-gray-800 rounded mb-6 animate-pulse" />
          <div className="aspect-video bg-gray-900 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!currentMovie) return null;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 bg-[#050505] overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto mb-2">
        Trailers
      </p>
      <p className="text-gray-500 text-sm max-w-[960px] mx-auto mb-6">
        {currentMovie.title}{" "}
        {currentMovie.year && (
          <span className="text-gray-600">· {currentMovie.year}</span>
        )}
      </p>

      {/* Main Player */}
      <div className="relative mx-auto max-w-[960px] aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
       <iframe
  key={currentMovie._id}
  width="100%"
  height="100%"
  src={toEmbedUrl(currentMovie.trailerUrl)}
  title={`${currentMovie.title} Trailer`}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="absolute inset-0 w-full h-full"
/>
      </div>

      {/* Thumbnail Strip */}
      {movies.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 max-w-[960px] mx-auto overflow-x-auto pb-3">
          {movies.map((movie) => (
            <div
              key={movie._id}
              onClick={() => setCurrentMovie(movie)}
              className={`relative flex-shrink-0 cursor-pointer transition-all duration-300 rounded-lg overflow-hidden border-2
                ${
                  currentMovie._id === movie._id
                    ? "border-[#FF4D67] scale-105 opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-28 md:w-36 h-20 md:h-24 object-cover"
              />
              {/* Title overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent px-2 py-1.5">
                <p className="text-white text-[10px] font-medium leading-tight line-clamp-1">
                  {movie.title}
                </p>
              </div>
              {/* Active play indicator */}
              {currentMovie._id === movie._id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-[#FF4D67] flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white ml-0.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrailersSection;