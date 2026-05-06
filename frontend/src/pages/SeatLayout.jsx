import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const SeatLayout = () => {
  const { showId, date, time } = useParams();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const navigate = useNavigate();

  // FETCH OCCUPIED SEATS
  const fetchSeats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7000/api/shows/${showId}`
      );

      if (res.data.success) {
        const key = `${date}_${time}`;
        const booked = res.data.show.occupiedSeats?.[key] || [];
        setOccupiedSeats(booked);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [showId, date, time]);

  // SELECT SEAT
  const toggleSeat = (seat) => {
    if (occupiedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  // BOOK
  const handleBooking = async () => {
    try {
      const res = await axios.post(
        "http://localhost:7000/api/shows/book",
        { showId, date, time, seats: selectedSeats },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Booked!");
        navigate("/my-booking");
        setSelectedSeats([]);
        fetchSeats();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // SINGLE SEAT UI
  const renderSeat = (row, num) => {
    const id = `${row}${num}`;
    const isBooked = occupiedSeats.includes(id);
    const isSelected = selectedSeats.includes(id);

    return (
      <div
        key={id}
        onClick={() => toggleSeat(id)}
        className={`
          w-10 h-10 flex items-center justify-center text-xs rounded-md border transition-all
          ${
            isBooked
              ? "bg-gray-700 cursor-not-allowed border-gray-700"
              : "bg-transparent border-red-500 hover:bg-red-500/20 cursor-pointer"
          }
          ${isSelected ? "!bg-red-500 text-white scale-110" : ""}
        `}
      >
        {id}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0b0b] to-[#1a0b0e] text-white flex">

    {/* LEFT PANEL */}
    <div className="w-72 p-8">
      <div className="bg-gradient-to-b from-[#2a0f14] to-[#1a0b0e] rounded-2xl p-6 shadow-xl border border-red-500/10">
        <h3 className="mb-6 font-semibold text-gray-300">
          Available Timings
        </h3>

        <div className="flex flex-col gap-4">
          {[time].map((t, i) => (
            <button
              key={i}
              className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
            >
              ⏱ {t}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="flex-1 flex flex-col items-center justify-center">

      {/* TITLE */}
      <h2 className="text-2xl font-semibold mb-8 tracking-wide">
        Select Your Seat
      </h2>

      {/* CURVED SCREEN */}
      <div className="relative mb-16">
        <div className="w-[500px] h-6 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full blur-[1px]"></div>
        <p className="text-xs text-gray-400 text-center mt-2">
          SCREEN SIDE
        </p>
      </div>

      {/* SEAT AREA */}
      <div className="flex flex-col gap-6">

        {"ABCDEFG".split("").map((row) => (
          <div key={row} className="flex items-center gap-6">

            {/* ROW LABEL */}
            <span className="w-4 text-gray-500">{row}</span>

            {/* LEFT BLOCK */}
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 8 }).map((_, i) =>
                renderSeat(row, i + 1)
              )}
            </div>

            {/* AISLE GAP */}
            <div className="w-6"></div>

            {/* RIGHT BLOCK */}
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 8 }).map((_, i) =>
                renderSeat(row, i + 9)
              )}
            </div>

          </div>
        ))}

        {/* SEAT NUMBERS */}
        <div className="flex justify-center gap-16 mt-4 text-xs text-gray-500">
          <div className="flex gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>{i + 9}</span>
            ))}
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleBooking}
        className="mt-12 px-12 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 font-semibold shadow-lg hover:scale-105 transition"
      >
        Proceed to checkout →
      </button>
    </div>
  </div>
  );
};

export default SeatLayout;