import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets'
import { StarIcon, CheckIcon, Trash2Icon } from 'lucide-react'
import Title from '../../components/admin/Title'
import Loading from '../../components/Loading'

const AddShows = () => {

    const currency = import.meta.env.VITE_CURRENCY || "$"
    
    // State management based on Screenshots 1 & 10
    const [nowPlayingMovies, setNowPlayingMovies] = useState([])
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [dateTimeSelection, setDateTimeSelection] = useState({})
    const [dateTimeInput, setDateTimeInput] = useState("")
    const [showPrice, setShowPrice] = useState("")
    const [loading, setLoading] = useState(true)

    // Helper for formatting vote counts (Screenshot 4)
    const kConverter = (num) => {
        return Math.abs(num) > 999 ? (Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1))) + 'k' : Math.sign(num) * Math.abs(num);
    }

    const fetchNowPlayingMovies = async () => {
        setNowPlayingMovies(dummyShowsData)
        setLoading(false)
    }

    useEffect(() => {
        fetchNowPlayingMovies()
    }, [])

    // Handler to add time slots to a specific date (Screenshot 10)
    const handleAddTime = () => {
        if (!dateTimeInput) return;
        
        const dateObj = new Date(dateTimeInput);
        const date = dateObj.toLocaleDateString('en-CA'); // YYYY-MM-DD
        const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        setDateTimeSelection(prev => {
            const currentTimes = prev[date] || [];
            if (!currentTimes.includes(time)) {
                return { ...prev, [date]: [...currentTimes, time] };
            }
            return prev;
        });
        setDateTimeInput("");
    }

    const handleRemoveTime = (date, timeToRemove) => {
        setDateTimeSelection(prev => {
            const updatedTimes = prev[date].filter(t => t !== timeToRemove);
            const newSelection = { ...prev };
            if (updatedTimes.length === 0) {
                delete newSelection[date];
            } else {
                newSelection[date] = updatedTimes;
            }
            return newSelection;
        });
    }

    return !loading ? (
        <div className="pb-10">
            <Title text1="Add" text2="Shows" />
            
            {/* Movie Selection Section (Screenshots 2-5) */}
            <p className="mt-10 text-lg font-medium text-gray-200">Now Playing Movies</p>
            <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-4 mt-4 w-max">
                    {nowPlayingMovies.map((movie) => (
                        <div 
                            key={movie.id} 
                            onClick={() => setSelectedMovie(movie.id)}
                            className={`relative max-w-40 cursor-pointer transition-all duration-300 hover:-translate-y-1 
                            ${selectedMovie && selectedMovie !== movie.id ? 'opacity-40' : 'opacity-100'}`}
                        >
                            <div className="relative rounded-lg overflow-hidden border border-white/5">
                                <img src={movie.poster_path} alt={movie.title} className="w-full object-cover brightness-90" />
                                
                                {/* Selected Indicator (Screenshot 5) */}
                                {selectedMovie === movie.id && (
                                    <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded shadow-lg">
                                        <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />
                                    </div>
                                )}

                                {/* Overlay Stats (Screenshot 3-4) */}
                                <div className="text-[10px] flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                                    <p className="flex items-center gap-1 text-gray-400">
                                        <StarIcon className="w-3 h-3 text-primary fill-primary" />
                                        {movie.vote_average.toFixed(1)}
                                    </p>
                                    <p className="text-gray-300">{kConverter(movie.vote_count)} Votes</p>
                                </div>
                            </div>
                            <p className="font-medium truncate mt-2 text-sm text-gray-200">{movie.title}</p>
                            <p className="text-gray-500 text-xs">{movie.release_date}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Show Price Input (Screenshot 7-8) */}
            <div className="mt-8">
                <label className="block text-sm font-medium mb-2 text-gray-300">Show Price</label>
                <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md bg-white/5 focus-within:border-primary transition-colors">
                    <p className="text-gray-400 text-sm">{currency}</p>
                    <input 
                        min={0} type="number" 
                        value={showPrice} 
                        onChange={(e) => setShowPrice(e.target.value)}
                        placeholder="Enter show price" 
                        className="bg-transparent outline-none text-white text-sm w-32"
                    />
                </div>
            </div>

            {/* Date and Time Picker (Screenshot 11) */}
            <div className="mt-8">
                <label className="block text-sm font-medium mb-2 text-gray-300">Select Date and Time</label>
                <div className="flex gap-2">
                    <input 
                        type="datetime-local" 
                        value={dateTimeInput}
                        onChange={(e) => setDateTimeInput(e.target.value)}
                        className="bg-white/5 border border-gray-600 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors"
                    />
                    <button 
                        onClick={handleAddTime}
                        className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-all"
                    >
                        Add Time
                    </button>
                </div>
            </div>

            {/* Display Selected Times (Screenshot 9-10) */}
            {Object.keys(dateTimeSelection).length > 0 && (
                <div className="mt-8 animate-fadeIn">
                    <h2 className="mb-4 text-sm font-semibold text-gray-200 border-l-4 border-primary pl-2">Selected Date-Time</h2>
                    <ul className="space-y-6">
                        {Object.entries(dateTimeSelection).map(([date, times]) => (
                            <li key={date}>
                                <div className="font-medium text-gray-300 text-sm mb-2">{date}</div>
                                <div className="flex flex-wrap gap-3">
                                    {times.map((time) => (
                                        <div key={time} className="border border-primary/40 bg-primary/5 px-3 py-1.5 flex items-center rounded-md text-xs text-gray-200 group">
                                            <span>{time}</span>
                                            <Trash2Icon 
                                                onClick={() => handleRemoveTime(date, time)}
                                                className="w-3.5 h-3.5 ml-2 text-red-500 hover:text-red-400 cursor-pointer transition-colors" 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Final Submit Button (Screenshot 11) */}
            <button className="mt-12 w-full md:w-auto bg-primary text-white px-10 py-3 rounded-lg font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
                ADD SHOW
            </button>
        </div>
    ) : (
        <Loading />
    )
}

export default AddShows