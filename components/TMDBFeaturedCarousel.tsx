
import React, { useState, useEffect, useRef } from 'react';
import { Media } from '../types';
import { getTMDBImageUrl } from '../services/tmdb';

interface Props {
  onMovieClick: (m: Media) => void;
  localMedia?: Media[];
}

const TMDBFeaturedCarousel: React.FC<Props> = ({ onMovieClick, localMedia = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;

  // Auto-rotate the featured stack
  useEffect(() => {
    if (localMedia.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % localMedia.length);
    }, 8000); // Slower rotation for better user experience
    return () => clearInterval(interval);
  }, [localMedia.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveIndex((current) => (current + 1) % localMedia.length);
    } else if (isRightSwipe) {
      setActiveIndex((current) => (current - 1 + localMedia.length) % localMedia.length);
    }
  };

  if (localMedia.length === 0) return null;

  return (
    <div 
      className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center bg-black touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <style>{`
        .cover-flow-container {
          perspective: 1400px;
          transform-style: preserve-3d;
        }
        .poster-card {
          transition: all 0.9s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
        }
        .poster-reflection {
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%);
          transform: scaleY(-1) translateY(-100%);
          filter: blur(4px);
          opacity: 0.2;
        }
        .genre-tag {
          background: #9f1239; /* UI Color Red */
          color: #fff;
          font-weight: 900;
          font-size: 7px;
          padding: 3px 8px;
          text-transform: uppercase;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(159, 18, 57, 0.4);
          letter-spacing: 0.1em;
        }
        .rating-badge {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fbbf24;
          font-size: 10px;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 6px;
        }
      `}</style>

      {/* Cinematic Background Blur */}
      <div className="absolute inset-0 z-0">
        <img 
          src={localMedia[activeIndex].poster || localMedia[activeIndex].image || getTMDBImageUrl(localMedia[activeIndex].tmdbData?.poster_path)} 
          className="w-full h-full object-cover blur-[80px] opacity-40 scale-125 transition-all duration-1000"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40"></div>
      </div>

      {/* Cover Flow Stack */}
      <div className="relative w-full max-w-5xl h-[400px] flex items-center justify-center cover-flow-container z-10">
        {localMedia.map((m, index) => {
          const offset = index - activeIndex;
          
          let displayOffset = offset;
          if (offset > localMedia.length / 2) displayOffset -= localMedia.length;
          if (offset < -localMedia.length / 2) displayOffset += localMedia.length;
          
          const isActive = index === activeIndex;
          const zIndex = 100 - Math.abs(displayOffset);
          const opacity = isActive ? 1 : Math.max(0, 0.5 - Math.abs(displayOffset) * 0.15);
          
          const translateX = displayOffset * 90; 
          const translateZ = isActive ? 120 : -180 * Math.abs(displayOffset); 
          const rotateY = displayOffset * -25; 
          const scale = isActive ? 0.95 : 0.65;

          const posterUrl = m.poster || m.image || getTMDBImageUrl(m.tmdbData?.poster_path);
          const genres = m.genre?.split(/[&,]/).map(g => g.trim()) || ['Featured'];
          const rating = m.tmdbData?.vote_average ? m.tmdbData.vote_average.toFixed(1) : '8.5';

          return (
            <div 
              key={m.id}
              onClick={() => isActive ? onMovieClick(m) : setActiveIndex(index)}
              className="absolute w-[200px] sm:w-[260px] aspect-[2/3] poster-card cursor-pointer"
              style={{
                zIndex,
                opacity,
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
              }}
            >
              {/* Main Poster */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-[1px] border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] bg-zinc-900">
                <img 
                  src={posterUrl} 
                  className="w-full h-full object-cover" 
                  alt={m.title}
                />
                
                {isActive && (
                  <>
                    {/* Top Badges */}
                    <div className="absolute top-4 left-0 w-full flex justify-between items-center px-4 z-20">
                      <div className="flex gap-1.5">
                        {genres.slice(0, 2).map((g, i) => (
                          <span key={i} className="genre-tag">{g}</span>
                        ))}
                      </div>
                      <div className="rating-badge flex items-center gap-1">
                        <i className="fas fa-star text-[7px]"></i>
                        {rating}
                      </div>
                    </div>

                    {/* Bottom Info Overlay - No Synopsis as requested */}
                    <div className="absolute bottom-0 left-0 w-full p-4 pt-12 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-1">
                      <h2 className="text-sm sm:text-lg font-black text-white uppercase tracking-tighter leading-tight drop-shadow-md truncate">
                        {m.title}
                      </h2>
                      <div className="mt-1 w-8 h-0.5 bg-[#9f1239] rounded-full"></div>
                    </div>
                  </>
                )}
              </div>

              {/* Reflection Effect */}
              <div className="absolute top-[100%] left-0 w-full aspect-[2/3] poster-reflection pointer-events-none">
                <div className="w-full h-full rounded-[2rem] overflow-hidden border-[1px] border-white/5">
                   <img src={posterUrl} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Line Indicators */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2 z-20 px-10">
        <div className="max-w-xs w-full flex gap-1">
          {localMedia.map((_, i) => (
            <div 
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-0.5 flex-1 cursor-pointer transition-all duration-700 rounded-full ${i === activeIndex ? 'bg-[#9f1239] shadow-[0_0_8px_rgba(159,18,57,0.8)]' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TMDBFeaturedCarousel;
