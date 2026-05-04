import React from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'

const  Favorites= () => {
  // Use the logic from Screenshot 2026-05-03 000918.jpg for data validation
  return dummyShowsData.length > 0 ? (
   <div className='relative pt-32 pb-20 px-6 md:px-16 lg:px-40 xl:px-44 min-h-screen bg-[#050505] text-white'>
      {/* Title Header matching Screenshot 2026-05-03 000918.jpg */}
      <h1 className='text-lg font-medium my-4'>You Favorites movies</h1>
      
      {/* Grid container forced to 4 columns on large screens */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10'>
        {dummyShowsData.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>

    </div>
  ) : (
    /* Fallback UI for empty data */
    <div className='min-h-[80vh] bg-[#050505] flex items-center justify-center text-gray-500'>
        <p>No movies found.</p>
    </div>
  )
}

export default Favorites