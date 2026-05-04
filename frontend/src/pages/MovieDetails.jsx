import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyShowsData, dummyDateTimeData } from '../assets/assets'
import { StarIcon, PlayCircleIcon, Heart } from 'lucide-react'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'


const MovieDetails = () => {
    const { id } = useParams()
    const [show, setShow] = useState(null)
    const navigate=useNavigate()

    // Utility to format runtime (matching your timeFormat.js requirement)
    const timeFormat = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    const getShow = async () => {
        // Finding the specific movie by the ID from the URL
        const showData = dummyShowsData.find(item => item._id === id)
        if (showData) {
            setShow({
                movie: showData,
                dateTime: dummyDateTimeData
            })
        }
    }

    useEffect(() => {
        getShow()
    }, [id])

    return show ? (
        <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50 bg-[#050505] min-h-screen text-white'>
            <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
                
                {/* Poster Image */}
                <img 
                    src={show.movie.poster_path} 
                    alt={show.movie.title} 
                    className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover shadow-2xl' 
                />

                <div className='relative flex flex-col gap-3'>
                    {/* Background Glow */}

                    <p className='text-primary font-bold text-sm tracking-widest uppercase'>
                        {show.movie.original_language === 'en' ? 'English' : show.movie.original_language}
                    </p>

                    <h1 className='text-4xl font-semibold max-w-96 text-balance leading-tight'>
                        {show.movie.title}
                    </h1>

                    <div className='flex items-center gap-2 text-gray-300'>
                        <StarIcon className="w-5 h-5 text-primary fill-primary" />
                        <span className='font-medium'>
                            {show.movie.vote_average.toFixed(1)}
                        </span>
                        <span className='text-sm text-gray-400'>User Rating</span>
                    </div>

                    <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl italic'>
                        "{show.movie.tagline}"
                    </p>

                    <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>
                        {show.movie.overview}
                    </p>

                    <p className='flex items-center gap-2 text-sm font-medium mt-2'>
                        {timeFormat(show.movie.runtime)} • 
                        {show.movie.genres.map(genre => genre.name).join(", ")} • 
                        {show.movie.release_date.split("-")[0]}
                    </p>

                    {/* Action Buttons */}
                    <div className='flex items-center flex-wrap gap-4 mt-4'>
                        <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
                            <PlayCircleIcon className="w-5 h-5" />
                            Watch Trailer
                        </button>

                        <a 
                            href="#booking-section" 
                            className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95 text-center'
                        >
                            Buy Tickets
                        </a>

                        <button className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95 hover:bg-gray-600'>
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            {/* Cast Section */}
<div className='mt-20'>
    <p className='text-lg font-medium'>Your Favorite Cast</p>
    
    <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-6 w-max px-4'>
            {show.movie.casts.slice(0, 12).map((cast, index) => (
                <div key={index} className='flex flex-col items-center text-center gap-2 w-24'>
                    <img 
                        src={cast.profile_path} 
                        alt={cast.name} 
                        className='rounded-full h-20 md:h-24 aspect-square object-cover border-2 border-white/5 shadow-lg' 
                    />
                    <div className='space-y-0.5'>
                        <p className='text-sm font-semibold text-white truncate w-24'>
                            {cast.name}
                        </p>
                        {/* Optional: if your data includes character names */}
                        {cast.character && (
                            <p className='text-[10px] text-gray-500 truncate w-24'>
                                {cast.character}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>
<DateSelect dateTime={show.dateTime} id={id} />
{/* Related Movies Section */}
<div className='mt-20'>
    <p className='text-lg font-medium mb-8'>You May Also Like</p>
    
    {/* Grid matching your 4-column preference */}
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-sm:justify-center'>
        {dummyShowsData.slice(0, 4).map((movie, index) => (
            <MovieCard key={index} movie={movie} />
        ))}
    </div>

    {/* Center "Show More" Button */}
    <div className='flex justify-center mt-20'>
        <button 
            onClick={() => { navigate('/movies'); window.scrollTo(0, 0); }}
            className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull text-white transition rounded-md font-medium cursor-pointer active:scale-95 shadow-lg shadow-primary/20'
        >
            Show more
        </button>
    </div>
</div>
        </div>
        
    ) : (
       <Loading />
    )
}

export default MovieDetails