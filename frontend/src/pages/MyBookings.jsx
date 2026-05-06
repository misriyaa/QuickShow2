import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ FIXED
import Loading from "../components/Loading";
import { timeFormat } from "../library/timeFormat";
import { dateFormat } from "../library/dateFormat";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:7000/api/bookings/my",
        { withCredentials: true } // ✅ IMPORTANT
      );

      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-32 md:pt-40 min-h-screen bg-[#050505] text-white pb-20">
      <h1 className="text-xl font-bold mb-8 tracking-wide">My Bookings</h1>

      <div className="flex flex-col gap-6">
        {bookings.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between bg-[#120b0e] border border-white/5 rounded-2xl p-3 md:p-4 max-w-4xl"
          >
            {/* LEFT */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative overflow-hidden rounded-xl w-full md:w-48 lg:w-56 aspect-video">
               <img
  src={
    item.show.movie.posterUrl?.startsWith("http")
      ? item.show.movie.posterUrl
      : `http://localhost:7000${item.show.movie.posterUrl}`
  }
  alt={item.show.movie.title}
/>
              </div>

              <div className="flex flex-col justify-center py-2">
                <p className="text-lg font-bold">
                  {item.show.movie.title}
                </p>

                {/* <p className="text-gray-500 text-xs mt-1">
                  {timeFormat(item.show.movie.runtime)}
                </p> */}

                <p className="text-gray-400 text-sm mt-3">
                  {dateFormat(item.date)} | {item.time} {/* ✅ FIXED */}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col md:items-end justify-between mt-4 md:mt-0">
              <div className="flex items-center gap-4">
                <p className="text-2xl font-black">
                  {currency}
                  {item.amount}
                </p>

                {!item.isPaid && (
                  <button className="bg-red-500 px-4 py-1 text-xs rounded">
                    Pay Now
                  </button>
                )}
              </div>

              <div className="text-sm mt-3">
                <p>
                  Total Tickets:{" "}
                  <span className="font-bold">
                    {item.seats.length}
                  </span>
                </p>

                <p>
                  Seats:{" "}
                  <span className="text-red-400 font-bold">
                    {item.seats.join(", ")} {/* ✅ FIXED */}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;