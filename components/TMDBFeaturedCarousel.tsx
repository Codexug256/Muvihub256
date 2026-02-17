
import React from 'react';
import { Media } from '../types';

interface Props {
  onMovieClick: (m: Media) => void;
  localMedia?: Media[];
}

const TMDBFeaturedCarousel: React.FC<Props> = ({ onMovieClick, localMedia = [] }) => {
  // Use the static hero image as requested
  const heroImage = "https://iili.io/qdpmQXs.jpg";

  return (
    <div className="relative h-[75vh] w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Hero Banner"
          className="w-full h-full object-cover"
          // @ts-ignore
          fetchpriority="high"
        />
        
        {/* Modern UI Overlay: Deeper bottom gradient for better transition to content */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent"></div>
        
        {/* Subtle vignette for a more premium look */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.4)]"></div>
      </div>
      
      {/* Content Section - Title, Synopsis, and Buttons removed per request */}
      {/* We only leave the bottom gradient area for a smooth flow into the welcome section */}

      {/* Scroll Down Hint - Modernized: More subtle and floating */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 animate-bounce opacity-20 transition-opacity hover:opacity-50">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default TMDBFeaturedCarousel;
