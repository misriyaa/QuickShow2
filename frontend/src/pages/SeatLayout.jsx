import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dummyShowsData, dummyDateTimeData } from '../assets/assets';
import { ClockIcon, ChevronRight } from 'lucide-react';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import { ISOtimeFormat } from '../library/ISOtimeFormat';

const SeatLayout = () => {
    const { id, date } = useParams();
    const navigate = useNavigate();

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [show, setShow] = useState(null);

    const readableDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    useEffect(() => {
        const showData = dummyShowsData.find(s => s._id === id);
        if (showData) {
            setShow({
                movie: showData,
                dateTime: dummyDateTimeData
            });
        }
    }, [id]);

    // ✅ Seat click logic
    const toggleSeat = (seatId) => {
        if (!selectedTime) {
            return toast.error('Please select a time first');
        }

        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(s => s !== seatId);
            }

            if (prev.length >= 5) {
                toast.error('You can only select 5 seats');
                return prev;
            }

            return [...prev, seatId];
        });
    };

    // ✅ Checkout
    const handleCheckout = () => {
        if (!selectedTime) {
            return toast.error('Please select a time');
        }

        if (selectedSeats.length === 0) {
            return toast.error('Please select at least one seat');
        }

        navigate('/my-booking', {
            state: { selectedSeats, selectedTime, date, movie: show.movie }
        });

        window.scrollTo(0, 0);
    };

    // ✅ Seat renderer
const renderSeat = (row, num) => {
    const seatId = `${row}${num}`;
    const isSelected = selectedSeats.includes(seatId);

    return (
        <div
            key={seatId}
            onClick={() => toggleSeat(seatId)}
            className={`flex items-center justify-center
            w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9
            border rounded-md
            text-[7px] sm:text-[8px] md:text-[10px] font-semibold
            transition-all duration-300

            ${!selectedTime ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}

            ${isSelected
                ? 'bg-[#ff4d67] border-[#ff4d67] text-white scale-110'
                : 'border-[#ff4d67]/30 text-gray-400 hover:border-[#ff4d67] hover:text-white'
            }`}
        >
            {row}{num}
        </div>
    );
};
    // ✅ Row with 3 sections
    const SeatRow = ({ row }) => (
        <div className='flex items-center gap-4 md:gap-6'>
            <span className='text-[10px] text-gray-600 w-4 text-center font-bold'>
                {row}
            </span>

            {/* Left */}
            <div className='flex gap-1.5 md:gap-3'>
                {[1, 2, 3, 4].map(n => renderSeat(row, n))}
            </div>

            {/* Center */}
            <div className='flex gap-1.5 md:gap-3 mx-4 md:mx-8'>
                {[5, 6, 7, 8, 9, 10].map(n => renderSeat(row, n))}
            </div>

            {/* Right */}
            <div className='flex gap-1.5 md:gap-3'>
                {[11, 12, 13, 14].map(n => renderSeat(row, n))}
            </div>
        </div>
    );

    return show ? (
        <div className='bg-[#050505] min-h-screen text-white pt-24 md:pt-32 px-4 sm:px-10 md:px-16 lg:px-40 pb-20'>
            <div className='flex flex-col md:flex-row gap-8 lg:gap-16 items-start'>

                {/* 🎬 Time Selection */}
                <div className='w-full md:w-64 bg-[#120b0e] border border-white/5 rounded-2xl py-6 md:py-10 md:sticky md:top-32'>
                    <p className='text-sm font-semibold px-6 mb-6 text-gray-500'>
                        Available Timings
                    </p>

                    <div className='flex md:flex-col gap-2 px-4 overflow-x-auto md:overflow-visible'>
                        {show.dateTime[date]?.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedTime(item.time);
                                    setSelectedSeats([]); // reset seats
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all
                                ${selectedTime === item.time
                                        ? 'bg-[#ff4d67] text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <ClockIcon className="w-4 h-4" />
                                <p className='text-xs font-bold'>
                                    {ISOtimeFormat(item.time)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🎟 Seat Layout */}
                <div className='flex-1 w-full flex flex-col items-center bg-[#120b0e] border border-white/5 p-6 sm:p-10 rounded-2xl'>

                    <h2 className='text-xl font-bold mb-2'>Select Your Seat</h2>
                    <p className='text-[#ff4d67] text-xs mb-10'>{readableDate}</p>

                    {/* Screen */}
                    <div className='w-full max-w-xl mb-20'>
                        <div className='h-1 w-full bg-[#ff4d67] rounded-full'></div>
                        <p className='text-center text-[10px] text-gray-500 mt-2 tracking-widest'>
                            SCREEN SIDE
                        </p>
                    </div>

 <div className="w-full overflow-x-auto pb-4">
    <div className="min-w-[600px] md:min-w-0 flex flex-col gap-6 md:gap-8 items-center">

        {/* A & B */}
        {['A', 'B'].map(row => (
            <div key={row} className="flex justify-center gap-2">
                {[1,2,3,4,5,6,7,8,9].map(n => renderSeat(row, n))}
            </div>
        ))}

        {/* Paired Sections */}
        {[
            ['C', 'E'],
            ['D', 'F'],
            ['G', 'I'],
            ['H', 'J']
        ].map(([leftRow, rightRow]) => (
            <div key={leftRow} className="flex items-center gap-10 justify-center">

                {/* Left */}
                <div className="flex gap-2">
                    {[1,2,3,4,5,6,7,8,9].map(n => renderSeat(leftRow, n))}
                </div>

                {/* Right */}
                <div className="flex gap-2">
                    {[1,2,3,4,5,6,7,8,9].map(n => renderSeat(rightRow, n))}
                </div>

            </div>
        ))}

    </div>
</div>
                    {/* Button */}
                    <button
                        onClick={handleCheckout}
                        disabled={selectedSeats.length === 0}
                        className={`mt-20 px-12 py-4 rounded-full font-bold flex items-center gap-3 transition-all
                        ${selectedSeats.length > 0
                                ? 'bg-[#ff4d67] hover:bg-[#ff3352]'
                                : 'bg-white/10 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Proceed to checkout
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </div>
    ) : <Loading />;
};

export default SeatLayout;