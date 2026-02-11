
import React, { useState, useEffect, useRef } from 'react';
import { fetchNowPlaying, getTMDBImageUrl } from '../services/tmdb';
import { Media } from '../types';
import { shuffleArray } from '../utils';

interface Props {
  onMovieClick: (m: Media) => void;
  localMedia?: Media[];
}

const TMDBFeaturedCarousel: React.FC<Props> = ({ onMovieClick }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    const loadNewReleases = async () => {
      setLoading(true);
      try {
        const results = await fetchNowPlaying();
        // Reshuffle the new releases from TMDB API
        const reshuffled = shuffleArray(results).slice(0, 8);
        setMovies(reshuffled);
      } catch (err) {
        console.error("Failed to load new releases:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNewReleases();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % movies.length);
      }, 6000);
    }
    return () => clearInterval(intervalRef.current);
  }, [movies]);

  if (loading) return (
    <div className="h-screen w-full skeleton rounded-b-[3rem]"></div>
  );

  if (movies.length === 0) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {movies.map((m, i) => {
        const bgImage = getTMDBImageUrl(m.backdrop_path, 'original') || 
                        getTMDBImageUrl(m.poster_path, 'original') || 
                        'https://iili.io/KOR5eHX.png';

        // Map TMDB item to our Media type for the click handler
        const mediaItem: Media = {
          id: `tmdb-${m.id}`,
          title: m.title || m.name,
          type: 'tmdb_movie',
          description: m.overview,
          poster: getTMDBImageUrl(m.poster_path, 'w500') || '',
          image: bgImage,
          tmdbData: m,
          genre: 'New Release'
        };

        return (
          <div 
            key={m.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image */}
            <img 
              src={bgImage} 
              alt={m.title}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 pb-32 sm:p-16 flex flex-col justify-end items-start animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#9f1239] text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-[0.2em] shadow-lg">NEW RELEASE</span>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl px-3 py-1 rounded-md border border-white/10 text-yellow-500 text-sm font-bold shadow-lg">
                  <i className="fas fa-star"></i> {m.vote_average?.toFixed(1) || '8.0'}
                </div>
              </div>
              
              <h2 className="text-4xl sm:text-7xl font-black mb-4 uppercase tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] max-w-4xl leading-tight">
                {m.title || m.name}
              </h2>
              
              <p className="text-white/90 text-sm sm:text-lg mb-8 line-clamp-3 max-w-2xl font-medium drop-shadow-md leading-relaxed">
                {m.overview}
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => onMovieClick(mediaItem)}
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
        {movies.map((_, i) => (
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
