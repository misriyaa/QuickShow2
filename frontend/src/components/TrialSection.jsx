import React, { useState } from "react";
import ReactPlayer from 'react-player/lazy'
import { dummyTrailers } from "../assets/assets";

const TrailersSection = () => {
  // Initialize with the first object from dummyTrailers
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 bg-[#050505] overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto mb-6">
        Trailers
      </p>

      {/* 
          FIX: Added 'aspect-video' to ensure the container has height. 
          Without a height, the video stays invisible even if loaded. 
      */}
      <div className="relative mx-auto max-w-[960px] aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
       <iframe
  width="100%"
  height="100%"
  src={currentTrailer?.videoUrl.replace("watch?v=", "embed/")}
  title="Trailer"
  allow="autoplay; encrypted-media"
  allowFullScreen
/>
      </div>

      {/* Thumbnail Selection - Matches Screenshot 2026-05-02 234616.png */}
      <div className="flex items-center justify-center gap-5 mt-10 max-w-[960px] mx-auto overflow-x-auto pb-4">
        {dummyTrailers.map((trailer, index) => (
          <div
            key={index}
            onClick={() => setCurrentTrailer(trailer)}
            className={`relative flex-shrink-0 cursor-pointer transition-all duration-300 rounded-lg overflow-hidden border-2 
              ${
                currentTrailer.videoUrl === trailer.videoUrl
                  ? "border-[#FF4D67] scale-105 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
          >
            <img
              src={trailer.image}
              alt={`Thumbnail ${index}`}
              className="w-40 md:w-48 h-24 md:h-28 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection;
