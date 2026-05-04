import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import MovieCard from './MovieCard' 
// 1. IMPORT the dummyShowsData from your assets file
import { dummyShowsData } from '../assets/assets' 

const FeaturedSection = () => {
  const navigate = useNavigate()

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden bg-[#050505] pb-20'>
      
      {/* Header Section */}
      <div className='relative flex items-center justify-between pt-20 pb-10'>
        <p className='text-gray-300 font-medium text-lg'>Now Showing</p>
        
        <button 
          onClick={() => navigate('/movies')} 
          className='group flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer'
        >
          View All
          <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5' />
        </button>
      </div>

      {/* 2. MAP the actual data from your assets file */}
     <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-8'>
          {dummyShowsData.slice(0, 8).map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
      </div>

      {/* "Show More" Button */}
      <div className='flex justify-center mt-12'>
        <button 
          onClick={() => { navigate('/movies'); window.scrollTo(0, 0); }}
          className='bg-[#FF4D67] hover:bg-[#ff3653] text-white px-10 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#FF4D67]/20'
        >
          Show more
        </button>
      </div>

    </div>
  )
}

export default FeaturedSection