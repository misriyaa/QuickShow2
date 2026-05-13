import React, { useState } from "react";
import axios from "axios";

const AddMovie = () => {
  const initialState = {
    language: "",
    year: "",
    title: "",
    rating: "",
    runtime: "",
    genres: "",
    tagline: "",
    overview: "",
    trailerUrl: "",
    posterUrl: "",
    cast: [{ name: "", photoUrl: "" }],
  };

  const [movie, setMovie] = useState(initialState);

  const handleInput = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleCast = (i, e) => {
    const updated = [...movie.cast];
    updated[i][e.target.name] = e.target.value;
    setMovie({ ...movie, cast: updated });
  };

  const addCast = () => {
    setMovie({
      ...movie,
      cast: [...movie.cast, { name: "", photoUrl: "" }],
    });
  };

  const removeCast = (i) => {
    setMovie({
      ...movie,
      cast: movie.cast.filter((_, index) => index !== i),
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...movie,
        genres:
          typeof movie.genres === "string"
            ? movie.genres.split(",").map((g) => g.trim()).filter(Boolean)
            : movie.genres,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/movies/add`,
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Movie added");
        setMovie(initialState);
      } else {
        alert(res.data.message || "Failed to add movie");
      }
    } catch (err) {
      console.log(err);
      alert("Error adding movie");
    }
  };

  const inputClass = "w-full p-2 bg-gray-900 rounded text-white placeholder-gray-500 outline-none";

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Add Movie</h2>

      <form onSubmit={submit} className="max-w-3xl mx-auto space-y-3">

        <input name="title" placeholder="Title *" onChange={handleInput} value={movie.title} className={inputClass} required />

        <input name="language" placeholder="Language *" onChange={handleInput} value={movie.language} className={inputClass} required />

        <input name="year" placeholder="Year *" onChange={handleInput} value={movie.year} className={inputClass} required />

        <input name="rating" placeholder="Rating (e.g. 8.5)" onChange={handleInput} value={movie.rating} className={inputClass} />

        <input name="runtime" placeholder="Runtime (e.g. 2h 30m)" onChange={handleInput} value={movie.runtime} className={inputClass} />

        <input name="genres" placeholder="Genres (Action, Drama, Thriller)" onChange={handleInput} value={movie.genres} className={inputClass} />

        <input name="tagline" placeholder="Tagline" onChange={handleInput} value={movie.tagline} className={inputClass} />

        <textarea name="overview" placeholder="Overview" onChange={handleInput} value={movie.overview} className={inputClass} rows={4} />

        <input name="trailerUrl" placeholder="Trailer URL" onChange={handleInput} value={movie.trailerUrl} className={inputClass} />

        <input name="posterUrl" placeholder="Poster URL" onChange={handleInput} value={movie.posterUrl} className={inputClass} />

        {/* CAST */}
        <h3 className="text-lg font-semibold mt-4">Cast</h3>

        {movie.cast.map((c, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              name="name"
              placeholder="Actor Name"
              value={c.name}
              onChange={(e) => handleCast(i, e)}
              className="flex-1 p-2 bg-gray-900 rounded text-white placeholder-gray-500 outline-none"
            />
            <input
              name="photoUrl"
              placeholder="Photo URL"
              value={c.photoUrl}
              onChange={(e) => handleCast(i, e)}
              className="flex-1 p-2 bg-gray-900 rounded text-white placeholder-gray-500 outline-none"
            />
            <button
              type="button"
              onClick={() => removeCast(i)}
              className="px-3 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addCast}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          + Add Cast
        </button>

        <div className="pt-4">
          <button type="submit" className="w-full bg-green-600 py-2 rounded hover:bg-green-700 font-semibold">
            Save Movie
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddMovie;