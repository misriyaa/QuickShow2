import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import toast from 'react-hot-toast'; // Import toast

const DateSelect = ({ dateTime, id }) => {
  const navigate = useNavigate();

  // Guard: if no data, don’t render
  if (!dateTime || Object.keys(dateTime).length === 0) {
    return null;
  }

  // 1. Initialize with null so no date is pre-selected
  const [selectedDate, setSelectedDate] = useState(null);

  // 2. Handle the Book Now logic
  const onBookHandler = () => {
    if (!selectedDate) {
      // Show toaster warning if no date is selected
      return toast('Please select a date');
    }

    // Navigate to the next page (e.g., Seat Layout) with movie id and selected date
    navigate(`/movies/${id}/${selectedDate}`);
    window.scrollTo(0, 0);
  };

  return (
    <div id='booking-section' className='pt-10'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-[#120b0e] border border-white/5 rounded-2xl'>
        
        {/* Left Section: Date Picker */}
        <div className='flex flex-col gap-6 w-full md:w-auto'>
          <p className='text-xl font-bold text-white'>Choose Date</p>
          
          <div className='flex items-center gap-4'>
            <ChevronLeftIcon className='text-[#ff4d67] cursor-pointer hover:scale-110 transition-transform' strokeWidth={3} size={24} />
            
            <div className='flex items-center gap-3 overflow-x-auto no-scrollbar'>
              {Object.keys(dateTime).map((date) => {
                const d = new Date(date);
                const isSelected = selectedDate === date;

                return (
                  <button 
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center justify-center min-w-[70px] h-[85px] rounded-lg cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#ff4d67] border-[#ff4d67] text-white'
                        : 'bg-transparent border-white/10 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    <span className='text-xs font-medium'>
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className='text-xl font-bold mt-1'>
                      {d.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>

            <ChevronRightIcon className='text-[#ff4d67] cursor-pointer hover:scale-110 transition-transform' strokeWidth={3} size={24} />
          </div>
        </div>

        {/* Right Section: Book Button */}
        <div className='w-full md:w-64'>
          <button 
            onClick={onBookHandler}
            className='w-full bg-[#ff4d67] text-white py-4 rounded-full font-bold text-sm hover:bg-[#ff3352] transition-colors shadow-lg active:scale-95'
          >
            Book Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default DateSelect;