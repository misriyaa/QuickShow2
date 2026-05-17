import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../library/axios";
import toast from "react-hot-toast";

const SeatLayout = () => {
  const { showId, date, time } = useParams();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const navigate = useNavigate();

  // FETCH OCCUPIED SEATS
  const fetchSeats = async () => {
    try {
     const res = await axiosInstance.get(`/api/shows/${showId}`);


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
      const res = await axiosInstance.post("/api/shows/book", {
  showId, date, time, seats: selectedSeats,
});

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
          w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10
          flex items-center justify-center
          text-[9px] sm:text-[10px] md:text-xs
          rounded-md border transition-all duration-200
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
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0b0b] to-[#1a0b0e] text-white flex flex-col lg:flex-row overflow-x-hidden">

      {/* LEFT PANEL */}
      <div className="w-full lg:w-72 p-4 sm:p-6 lg:p-8">
        <div className="bg-gradient-to-b from-[#2a0f14] to-[#1a0b0e] rounded-2xl p-5 sm:p-6 shadow-xl border border-red-500/10">
          <h3 className="mb-6 font-semibold text-gray-300 text-lg">
            Available Timings
          </h3>

          <div className="flex flex-wrap lg:flex-col gap-4">
            {[time].map((t, i) => (
              <button
                key={i}
                className="flex items-center justify-center gap-2 bg-red-500 px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
              >
                ⏱ {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-start lg:justify-center px-2 sm:px-4 py-6 overflow-x-auto">

        {/* TITLE */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-8 tracking-wide text-center">
          Select Your Seat
        </h2>

        {/* CURVED SCREEN */}
        <div className="relative mb-10 sm:mb-16 w-full flex flex-col items-center">
          <div className="w-[260px] sm:w-[400px] md:w-[500px] h-4 sm:h-5 md:h-6 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full blur-[1px]"></div>

          <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2">
            SCREEN SIDE
          </p>
        </div>

        {/* SEAT AREA */}
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 min-w-max pb-4">

          {"ABCDEFG".split("").map((row) => (
            <div key={row} className="flex items-center gap-2 sm:gap-4 md:gap-6">

              {/* ROW LABEL */}
              <span className="w-3 sm:w-4 text-gray-500 text-xs sm:text-sm">
                {row}
              </span>

              {/* LEFT BLOCK */}
              <div className="grid grid-cols-8 gap-1 sm:gap-2">
                {Array.from({ length: 8 }).map((_, i) =>
                  renderSeat(row, i + 1)
                )}
              </div>

              {/* AISLE GAP */}
              <div className="w-2 sm:w-4 md:w-6"></div>

              {/* RIGHT BLOCK */}
              <div className="grid grid-cols-8 gap-1 sm:gap-2">
                {Array.from({ length: 8 }).map((_, i) =>
                  renderSeat(row, i + 9)
                )}
              </div>

            </div>
          ))}

          {/* SEAT NUMBERS */}
          <div className="flex justify-center gap-6 sm:gap-10 md:gap-16 mt-4 text-[10px] sm:text-xs text-gray-500">
            <div className="flex gap-1 sm:gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>

            <div className="flex gap-1 sm:gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i}>{i + 9}</span>
              ))}
            </div>
          </div>
        </div>

        {/* SELECTED INFO */}
        {selectedSeats.length > 0 && (
          <div className="mt-6 text-center px-4">
            <p className="text-sm sm:text-base text-gray-300">
              Selected Seats:
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {selectedSeats.map((seat) => (
                <span
                  key={seat}
                  className="bg-red-500/20 border border-red-500 px-3 py-1 rounded-full text-xs sm:text-sm"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleBooking}
          className="mt-10 sm:mt-12 px-8 sm:px-12 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 font-semibold shadow-lg hover:scale-105 transition text-sm sm:text-base"
        >
          Proceed to checkout →
        </button>
      </div>
    </div>
  );
};

export default SeatLayout;