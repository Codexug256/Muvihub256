
import React, { useState, useEffect, useRef } from 'react';
import { Media } from '../types';

interface Props {
  onMovieClick: (m: Media) => void;
  localMedia?: Media[];
}

const TMDBFeaturedCarousel: React.FC<Props> = ({ onMovieClick, localMedia = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<any>(null);

  // Use the list directly from props to ensure stability and avoid key issues during reshuffling
  const featuredItems = localMedia;

  useEffect(() => {
    if (featuredItems.length > 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % featuredItems.length);
      }, 6000);
    }
    return () => clearInterval(intervalRef.current);
  }, [featuredItems.length]);

  if (featuredItems.length === 0) return (
    <div className="h-screen w-full skeleton rounded-b-[3rem]"></div>
  );

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {featuredItems.map((m, i) => {
        // Preference: Original Backdrop -> Poster -> Fallback
        const bgImage = m.image || m.poster || 'https://iili.io/KOR5eHX.png';

        return (
          <div 
            key={m.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image with optimized loading */}
            <img 
              src={bgImage} 
              alt={m.title}
              className="w-full h-full object-cover"
              loading={i === currentIndex ? "eager" : "lazy"}
              // @ts-ignore
              fetchpriority={i === currentIndex ? "high" : "low"}
            />
            
            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 pb-32 sm:p-16 flex flex-col justify-end items-start animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#9f1239] text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-[0.2em] shadow-lg">FEATURED CONTENT</span>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl px-3 py-1 rounded-md border border-white/10 text-yellow-500 text-sm font-bold shadow-lg">
                  <i className="fas fa-fire"></i> Hot Now
                </div>
              </div>
              
              <h2 className="text-4xl sm:text-7xl font-black mb-4 uppercase tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] max-w-4xl leading-tight">
                {m.title}
              </h2>
              
              <p className="text-white/90 text-sm sm:text-lg mb-8 line-clamp-3 max-w-2xl font-medium drop-shadow-md leading-relaxed">
                {m.description || "Stream this cinematic masterpiece with exclusive Luganda commentary only on MuviHub UG."}
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => onMovieClick(m)}
                  className="bg-[#9f1239] text-white px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#be123c] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(159,18,57,0.4)] flex items-center gap-3"
                >
                  <i className="fas fa-play"></i> Watch Now
                </button>
                <button className="bg-white/10 backdrop-blur-xl text-white w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all shadow-xl">
                  <i className="fas fa-plus text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {featuredItems.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentIndex(i)} 
            className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-12 bg-[#9f1239]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
          ></button>
        ))}
      </div>

      {/* Scroll Down Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 animate-bounce opacity-40">
        <i className="fas fa-chevron-down text-white"></i>
      </div>
    </div>
  );
};

export default TMDBFeaturedCarousel;
