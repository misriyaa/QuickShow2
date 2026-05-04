import React from 'react'
import { useNavigate } from 'react-router-dom'
import { StarIcon } from 'lucide-react'
import timeFormat from '../library/timeFormat'

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()

  return (
    /* Removed w-66 and added w-full to fill the grid cell. Increased padding for a bigger look. */
    <div className='flex flex-col justify-between p-4 bg-gray-800 rounded-2xl hover:-translate-y-2 transition duration-300 w-full h-full shadow-xl'>
      
      {/* Movie Image - Increased height from h-52 to h-64 */}
      <img 
        onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0); }}
        src={movie.backdrop_path} 
        alt={movie.title} 
        className='rounded-xl h-64 w-full object-cover object-center cursor-pointer hover:opacity-90 transition-opacity'
      />

      {/* Movie Title - Increased text size */}
      <p className='font-bold text-lg mt-3 truncate text-white'>{movie.title}</p>

      {/* Metadata */}
      <p className='text-sm text-gray-400 mt-2'>
        {new Date(movie.release_date).getFullYear()} • {movie.genres.slice(0, 2).map(genre => genre.name).join(" | ")} • {timeFormat(movie.runtime)}
      </p>

      {/* Bottom Section */}
      <div className='flex items-center justify-between mt-5'>
        <button 
          onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0); }}
          className='px-5 py-2.5 text-xs bg-[#FF4D67] hover:bg-[#ff3653] text-white transition rounded-full font-bold cursor-pointer active:scale-95'
        >
          Buy Tickets
        </button>

        <p className='flex items-center gap-1 text-sm font-semibold text-gray-300'>
          <StarIcon className="w-4 h-4 text-[#FF4D67] fill-[#FF4D67]" />
          {movie.vote_average.toFixed(1)}
        </p>
      </div>
      
    </div>
  )
}

export default MovieCard