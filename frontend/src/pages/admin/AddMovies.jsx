import React, { useEffect, useState } from "react";
import axiosInstance from "../../library/axios"; 
import MovieCard from "../../components/MovieCard";

const AddShows = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [times, setTimes] = useState([]);
  const [price, setPrice] = useState("");

  // FETCH MOVIES
  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movies/all`);

      if (res.data.success) {
        setMovies(res.data.movies);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // ADD TIME
  const addTime = () => {
    if (!time) return;

    if (times.includes(time)) {
      alert("Time already added");
      return;
    }

    setTimes([...times, time]);
    setTime("");
  };

  // REMOVE TIME
  const removeTime = (index) => {
    const updated = times.filter((_, i) => i !== index);
    setTimes(updated);
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!selectedMovie) return alert("Select movie");
    if (!date) return alert("Select date");
    if (times.length === 0) return alert("Add at least one time");
    if (!price) return alert("Enter price");

    try {
      const res = await axiosInstance.post("/api/movies/add", payload);

      if (res.data.success) {
        alert("Show added successfully ✅");

        // RESET
        setSelectedMovie(null);
        setDate("");
        setTimes([]);
        setPrice("");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Error adding show");
    }
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Add Shows</h1>

      {/* MOVIES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div
            key={movie._id}
            onClick={() => setSelectedMovie(movie)}
            className={`cursor-pointer border rounded-lg p-2 ${
              selectedMovie?._id === movie._id
                ? "border-red-500"
                : "border-gray-700"
            }`}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* FORM */}
      {selectedMovie && (
        <div className="mt-10 bg-gray-900 p-6 rounded-lg">

          <h2 className="text-xl mb-4">
            Selected: {selectedMovie.title}
          </h2>

          {/* DATE */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 text-black w-full rounded mb-4"
          />

          {/* TIME */}
          <div className="flex gap-2 mb-4">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="p-2 text-black w-full rounded"
            />

            <button
              onClick={addTime}
              className="bg-green-500 px-4 rounded"
            >
              Add
            </button>
          </div>

          {/* TIME LIST */}
          <div className="flex gap-2 flex-wrap mb-4">
            {times.map((t, i) => (
              <span
                key={i}
                onClick={() => removeTime(i)}
                className="bg-gray-700 px-3 py-1 rounded cursor-pointer"
              >
                {t} ✕
              </span>
            ))}
          </div>

          {/* PRICE */}
          <input
            type="number"
            placeholder="Ticket Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 text-black w-full rounded mb-4"
          />

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            className="bg-red-500 px-6 py-2 rounded"
          >
            Save Show
          </button>

        </div>
      )}
    </div>
  );
};

export default AddShows;