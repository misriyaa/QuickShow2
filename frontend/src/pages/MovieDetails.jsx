import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { StarIcon, PlayCircleIcon, Heart, X } from "lucide-react";
import Loading from "../components/Loading";
import MovieCard from "../components/MovieCard";
import DateSelect from "../components/DateSelect";

const MovieDetails = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [dateTime, setDateTime] = useState({});
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showId, setShowId] = useState(null);

  const fetchData = async () => {
    try {
      const movieRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movies/all`);
      const showRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/shows/all`);

      if (movieRes.data.success) {
        const found = movieRes.data.movies.find((m) => m._id === id);
        setMovie(found || null);
        setAllMovies(movieRes.data.movies || []);
      }

      if (showRes.data.success) {
        const movieShows = showRes.data.shows.filter(
  (s) => (s.movie?._id || s.movie) === id
);

if (movieShows.length > 0) {
  setShowId(movieShows[0]._id); // ✅ IMPORTANT
}

        const formatted = {};
        movieShows.forEach((show) => {
          show.showDateTimes.forEach((d) => {
            formatted[d.date] = d.times;
          });
        });
        setDateTime(formatted);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const genres = Array.isArray(movie?.genres)
    ? movie.genres
    : movie?.genres?.split(",") || [];

  const getEmbedUrl = (url) => {
    if (!url) return "";
    let vid = "";
    if (url.includes("youtu.be")) {
      vid = url.split("/").pop().split("?")[0];
    } else if (url.includes("watch?v=")) {
      vid = url.split("v=")[1].split("&")[0];
    }
    return vid ? `https://www.youtube.com/embed/${vid}?autoplay=1` : url;
  };

  const scrollToBooking = () => {
    document.getElementById("booking-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  if (loading) return <Loading />;

  if (!movie) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        Movie not found.
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-[#ff4d6d]">
      
      {/* 🎬 HERO SECTION - Responsive Padding for Nav */}
      <div className="relative px-6 md:px-20 pt-24 md:pt-32 pb-12 flex flex-col lg:flex-row gap-12 items-center lg:items-start bg-gradient-to-b from-[#1a0b0e] to-[#0a0a0a]">
        
        {/* Poster */}
        <div className="shrink-0 shadow-2xl shadow-red-900/20 w-full max-w-[320px] md:max-w-[380px]">
          <img
            src={movie.posterUrl?.startsWith("http") ? movie.posterUrl : `${import.meta.env.VITE_BACKEND_URL}${movie.posterUrl}`}
            className="w-full h-auto object-cover rounded-3xl border border-white/10 shadow-2xl"
            alt={movie.title}
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6 w-full text-center lg:text-left">
          <span className="text-[#ff4d6d] uppercase tracking-[0.3em] font-bold text-xs md:text-sm">
            {movie.language || "English"}
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            {movie.title}
          </h1>

          <div className="flex items-center justify-center lg:justify-start gap-3 text-lg">
            <StarIcon className="text-[#ff4d6d] fill-[#ff4d6d]" size={20} />
            <span className="font-bold">{movie.rating}</span>
            <span className="text-gray-500 text-sm">IMDb Rating</span>
          </div>

          {/* RESPONSIVE OVERVIEW */}
          <p className="text-gray-400 text-base md:text-lg leading-relaxed italic max-w-3xl mx-auto lg:mx-0">
            {movie.overview}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-gray-300 font-medium border-l-0 lg:border-l-4 border-[#ff4d6d] lg:pl-4 py-1">
            <span>{movie.runtime}</span>
            <span className="text-gray-600 hidden md:inline">•</span>
            <span>{genres.join(" | ")}</span>
            <span className="text-gray-600 hidden md:inline">•</span>
            <span>{movie.year}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
            <button
              onClick={() => setShowTrailer(true)}
              className="flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-[#1e293b] hover:bg-[#334155] rounded-2xl font-bold transition-all border border-white/5"
            >
              <PlayCircleIcon size={24} />
              Trailer
            </button>

            <button
              onClick={scrollToBooking}
              className="px-8 md:px-10 py-3 md:py-4 bg-[#ff4d6d] hover:bg-[#ff3559] rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95"
            >
              Buy Ticket
            </button>

            <button className="p-3 md:p-4 bg-[#1e293b] rounded-2xl border border-white/5 text-gray-400 hover:text-white transition-all">
              <Heart size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* 🎭 CAST SECTION */}
      <div className="px-6 md:px-20 py-12">
        <h2 className="text-2xl font-bold mb-8">Your Favorite Cast</h2>
        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-4">
          {movie.cast?.map((c, i) => (
            <div key={i} className="flex flex-col items-center min-w-[110px] group">
              <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#ff4d6d] transition-all shadow-xl">
                <img
                  src={c.photoUrl?.startsWith("http") ? c.photoUrl : `${import.meta.env.VITE_BACKEND_URL}${c.photoUrl}`}
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  alt={c.name}
                />
              </div>
              <p className="text-sm font-bold mt-4 group-hover:text-[#ff4d6d] transition-colors">{c.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Actor</p>
            </div>
          ))}
        </div>
      </div>

      {/* 📅 BOOKING SECTION */}
      <div id="booking-section" className="px-6 md:px-20 py-12 scroll-mt-24">
        <DateSelect dateTime={dateTime} showId={showId} />
      </div>

      {/* RELATED MOVIES */}
      <div className="px-6 md:px-20 py-16 bg-gradient-to-t from-black to-transparent">
        <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
          <div className="w-1 h-8 bg-[#ff4d6d] rounded-full"></div>
          You may also like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {allMovies
            .filter((m) => m._id !== id)
            .slice(0, 5)
            .map((m) => (
              <MovieCard key={m._id} movie={m} />
            ))}
        </div>
      </div>

      {/* 🎥 TRAILER MODAL */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="relative w-full max-w-5xl aspect-video">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#ff4d6d] flex items-center gap-2 font-bold"
            >
              <X size={30} /> CLOSE
            </button>
            <iframe
              className="w-full h-full rounded-2xl border border-white/10"
              src={getEmbedUrl(movie.trailerUrl)}
              allowFullScreen
              title="Trailer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;