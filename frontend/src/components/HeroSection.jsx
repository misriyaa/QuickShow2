import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowRight, Play, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movies/all`).then((res) => {
      if (res.data.success) setMovies(res.data.movies.slice(0, 6));
    });
  }, []);

  // Auto-cycle every 5s
  useEffect(() => {
    if (movies.length < 2) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % movies.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [movies]);

  const goTo = (i) => {
    clearInterval(intervalRef.current);
    setActiveIndex(i);
  };

  const movie = movies[activeIndex];

  return (
    <div className="relative w-full h-screen bg-[#080808] overflow-hidden">

      {/* ── BACKGROUND: blurred poster pan ── */}
      {movies.map((m, i) => (
        <div
          key={m._id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        >
          <img
            src={m.posterUrl}
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover", filter: "blur(18px) brightness(0.25)", transform: "scale(1.1)" }}
          />
        </div>
      ))}

      {/* ── VIGNETTE ── */}
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-transparent to-black/80 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-[1]" />

      {/* ── MAIN LAYOUT ── */}
      <div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24 gap-8 md:gap-16">

        {/* LEFT — Movie Info */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* Now Showing tag */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-semibold tracking-[0.2em] uppercase">
              Now Showing
            </span>
          </div>

          {/* Title */}
          <div className="overflow-hidden">
            <h1
              key={movie?._id + "title"}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight"
              style={{ animation: "slideUp 0.5s ease forwards" }}
            >
              {movie?.title}
            </h1>
          </div>

          {/* Genres */}
          {movie?.genres?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {movie.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border border-white/15 text-gray-400"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-5 text-sm text-gray-400">
            {movie?.year && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-gray-500" />
                {movie.year}
              </span>
            )}
            {movie?.runtime && (
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-gray-500" />
                {movie.runtime}
              </span>
            )}
            {movie?.rating && (
              <span className="flex items-center gap-1.5">
                <span className="text-yellow-400 font-bold text-base">★</span>
                <span className="text-white font-semibold">{movie.rating}</span>
                <span className="text-gray-600">/10</span>
              </span>
            )}
          </div>

          {/* Overview */}
          <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-3 max-w-md">
            {movie?.overview}
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => navigate(`/movies/${movie?._id}`)}
              className="group bg-white hover:bg-gray-100 active:scale-95 transition-all px-7 py-3.5 rounded-full text-black font-bold flex items-center gap-2 text-sm"
            >
              Book Tickets
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
           
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 mt-2">
            {movies.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? "w-8 h-2 bg-white"
                    : "w-2 h-2 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — Poster Stack */}
        <div className="hidden md:flex items-center justify-center relative flex-shrink-0" style={{ width: "340px", height: "500px" }}>

          {/* Background stacked posters */}
          {movies.map((m, i) => {
            const offset = i - activeIndex;
            const visible = Math.abs(offset) <= 2;
            if (!visible) return null;
            const isActive = offset === 0;
            const isPrev = offset === -1 || (activeIndex === 0 && i === movies.length - 1);
            const isNext = offset === 1 || (activeIndex === movies.length - 1 && i === 0);

            return (
              <div
                key={m._id}
                onClick={() => goTo(i)}
                className="absolute cursor-pointer transition-all duration-700 rounded-2xl overflow-hidden"
                style={{
                  width: isActive ? "240px" : "160px",
                  height: isActive ? "360px" : "240px",
                  left: isActive
                    ? "50px"
                    : isPrev
                    ? "-30px"
                    : "220px",
                  top: "50%",
                  transform: `translateY(-50%) rotate(${isActive ? "0deg" : isPrev ? "-6deg" : "6deg"})`,
                  zIndex: isActive ? 10 : 1,
                  opacity: isActive ? 1 : 0.35,
                  boxShadow: isActive
                    ? "0 30px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)"
                    : "none",
                }}
              >
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM STRIP: Movie Thumbnails ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-16 lg:px-24 pb-6">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {movies.map((m, i) => (
            <button
              key={m._id}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 ${
                i === activeIndex
                  ? "bg-white/15 border border-white/20"
                  : "bg-white/5 border border-transparent hover:bg-white/10"
              }`}
            >
              <img
                src={m.posterUrl}
                alt={m.title}
                className="w-8 h-10 object-cover rounded-md flex-shrink-0"
              />
              <span className={`text-xs font-medium whitespace-nowrap ${i === activeIndex ? "text-white" : "text-gray-500"}`}>
                {m.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;