import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DateSelect = ({ dateTime, showId }) => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  if (!dateTime || Object.keys(dateTime).length === 0) {
    return <div className="text-gray-400 mt-10">No shows available</div>;
  }

  const onBookHandler = () => {
    if (!selectedDate) {
      return toast.error("Please select a date");
    }

    if (!selectedTime) {
      return toast.error("Please select a time");
    }

    if (!showId) {
      return toast.error("Show not available");
    }

    navigate(`/seat-layout/${showId}/${selectedDate}/${selectedTime}`);
  };

  return (
    <div className="mt-10">

      {/* DATE */}
      <div className="flex gap-3 mb-4">
        {Object.keys(dateTime).map((date) => (
          <button
            key={date}
            onClick={() => {
              setSelectedDate(date);
              setSelectedTime(null); // reset time
            }}
            className={`p-3 border ${
              selectedDate === date ? "bg-red-500" : ""
            }`}
          >
            {date}
          </button>
        ))}
      </div>

      {/* TIME (NEW) */}
      {selectedDate && (
        <div className="flex gap-3 mb-4">
          {dateTime[selectedDate].map((t, i) => (
            <button
              key={i}
              onClick={() => setSelectedTime(t)}
              className={`p-2 border ${
                selectedTime === t ? "bg-green-500" : ""
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={onBookHandler}
        className="bg-red-500 px-6 py-2"
      >
        Book Now
      </button>
    </div>
  );
};

export default DateSelect;