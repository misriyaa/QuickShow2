import React from 'react';
// Import the image from the path shown in your screenshot
import heroBg from '../assets/backgroundImage.png'; 
import { assets } from '../assets/assets';
import { CalendarIcon, ClockIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate=useNavigate()
  return (
    <div 
      // Use an inline style to apply the imported image
      style={{ backgroundImage: `url(${heroBg})` }}
      className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen text-white relative'
    >
      {/* Marvel Studios Logo */}
      <img 
        src={assets.marvelLogo} 
        alt="Marvel Studios" 
        className="max-h-11 lg:h-11 mt-20" 
      />

      {/* Movie Title */}
      <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>
        Guardians <br /> of the Galaxy
      </h1>

      {/* Meta Information */}
      <div className='flex items-center gap-4 text-gray-300 text-sm md:text-base'>
        <span>Action | Adventure | Sci-Fi</span>
        
        <div className='flex items-center gap-1'>
          <CalendarIcon className='w-4.5 h-4.5 text-gray-400' />
          <span>2018</span>
        </div>

        <div className='flex items-center gap-1'>
          <ClockIcon className='w-4.5 h-4.5 text-gray-400' />
          <span>2h 8m</span>
        </div>
      </div>

      <p className='max-w-xl text-gray-300 leading-relaxed text-sm md:text-base'>
        In a post-apocalyptic world where cities ride on wheels and consume each other to survive, 
        two people meet in London and try to stop a conspiracy.
      </p>

      <button onClick={()=>navigate('/movies')} className='flex items-center gap-2 bg-[#FF4D67] hover:bg-[#ff3653] text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#FF4D67]/20 mt-2'>
        Explore Movies
        <ArrowRight className='w-5 h-5' />
      </button>
    </div>
  );
};

export default HeroSection;