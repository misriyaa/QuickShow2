import React, { useState, useEffect } from 'react'
import Loading from '../components/Loading'
import { timeFormat } from '../library/timeFormat'
import { dateFormat } from '../library/dateFormat'
import { dummyBookingData } from '../assets/assets'

const MyBookings = () => {
  // Use VITE_CURRENCY from .env or default to $
  const currency = import.meta.env.VITE_CURRENCY || "$"

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getMyBookings = async () => {
    // Setting static data from assets
    setBookings(dummyBookingData)
    setIsLoading(false)
  }

  useEffect(() => {
    getMyBookings()
  }, [])

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-32 md:pt-40 min-h-screen bg-[#050505] text-white pb-20'>
      {/* Background Aesthetics */}
      

      <h1 className='text-xl font-bold mb-8 tracking-wide'>My Bookings</h1>

      <div className='flex flex-col gap-6'>
        {bookings.map((item, index) => (
          <div 
            key={index} 
            className='flex flex-col md:flex-row justify-between bg-[#120b0e] border border-white/5 rounded-2xl p-3 md:p-4 max-w-4xl hover:border-primary/20 transition-all group'
          >
            {/* Left: Movie Image and Details */}
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='relative overflow-hidden rounded-xl w-full md:w-48 lg:w-56 aspect-video md:aspect-[16/10]'>
                <img 
                  src={item.show.movie.poster_path} 
                  alt={item.show.movie.title} 
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' 
                />
              </div>
              
              <div className='flex flex-col justify-center py-2'>
                <p className='text-lg font-bold text-gray-100'>{item.show.movie.title}</p>
                <p className='text-gray-500 text-xs mt-1 font-medium'>{timeFormat(item.show.movie.runtime)}</p>
                <p className='text-gray-400 text-sm mt-4 md:mt-auto font-semibold'>
                   {dateFormat(item.show.showDateTime)}
                </p>
              </div>
            </div>

            {/* Right: Price, Status and Seats */}
            <div className='flex flex-col md:items-end md:text-right justify-between p-2 md:p-4 mt-4 md:mt-0'>
              <div className='flex items-center gap-4'>
                <p className='text-2xl font-black text-gray-100'>{currency}{item.amount}</p>
                {!item.isPaid && (
                  <button className='bg-[#ff4d67] px-6 py-2 text-xs rounded-full font-bold text-white shadow-lg shadow-[#ff4d67]/20 hover:bg-[#ff3352] active:scale-95 transition-all cursor-pointer'>
                    Pay Now
                  </button>
                )}
              </div>
              
              <div className='text-[13px] mt-4 md:mt-0'>
                <p className='mb-1'>
                  <span className='text-gray-500 font-medium'>Total Tickets:</span> 
                  <span className='ml-2 font-bold'>{item.bookedSeats.length}</span>
                </p>
                <p>
                  <span className='text-gray-500 font-medium'>Seat Number:</span> 
                  <span className='ml-2 font-bold text-[#ff4d67]'>{item.bookedSeats.join(", ")}</span>
                </p>
              </div>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className='py-20 text-center'>
             <p className='text-gray-600 font-medium'>No bookings found.</p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default MyBookings