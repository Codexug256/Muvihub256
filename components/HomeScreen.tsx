
import React, { useMemo } from 'react';
import { Media } from '../types';
import MediaCard from './MediaCard';
import TMDBFeaturedCarousel from './TMDBFeaturedCarousel';
import { CATEGORY_GROUPS } from '../constants';
import { shuffleArray } from '../utils';

interface Props {
  allMedia: Media[];
  continueWatching: Media[];
  mediaByGenre: Record<string, Media[]>;
  onMediaClick: (m: Media) => void;
  isSearching: boolean;
  onSeeAll: () => void;
  onGenreSeeAll: (g: string) => void;
  onMoviesSeeAll?: () => void;
  onSeriesSeeAll?: () => void;
  clearFilters: () => void;
  downloadProgress: Record<string, number>;
  featuredMedia?: Media[];
}

const HomeScreen: React.FC<Props> = ({ 
  allMedia, 
  continueWatching, 
  mediaByGenre, 
  onMediaClick, 
  isSearching, 
  onSeeAll, 
  onGenreSeeAll, 
  onMoviesSeeAll,
  onSeriesSeeAll,
  clearFilters,
  downloadProgress,
  featuredMedia = []
}) => {
  
  // Split media into types
  const movies = useMemo(() => shuffleArray(allMedia.filter(m => m.type === 'movie')), [allMedia]);
  const series = useMemo(() => shuffleArray(allMedia.filter(m => m.type === 'series')), [allMedia]);
  const shuffledAll = useMemo(() => shuffleArray(allMedia), [allMedia]);

  // Recently Added: Combined movies and series sorted by createdAt
  const recentlyAdded = useMemo(() => {
    return [...allMedia].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 15);
  }, [allMedia]);

  const groupedContent = useMemo(() => {
    return CATEGORY_GROUPS.map(group => {
      const filtered = allMedia.filter(m => 
        m.genre && group.tags.some(tag => m.genre?.toLowerCase().includes(tag.toLowerCase()))
      );
      return { ...group, list: shuffleArray(filtered) };
    }).filter(g => g.list.length > 0);
  }, [allMedia]);

  return (
    <div className="pb-10">
      {isSearching ? (
        <div className="px-5 pt-24">
          <div className="flex justify-between items-center my-6">
            <h2 className="text-2xl font-extrabold flex items-center gap-3">
              Search Results
              <span className="text-white/60 text-lg font-normal">({allMedia.length})</span>
            </h2>
            <button onClick={clearFilters} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold hover:border-[#9f1239]">
              <i className="fas fa-times mr-2"></i> Clear
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-2">
            {allMedia.map(m => (
              <MediaCard 
                key={m.id} 
                media={m} 
                onClick={() => onMediaClick(m)} 
                downloadProgress={downloadProgress[m.id]}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <TMDBFeaturedCarousel onMovieClick={onMediaClick} localMedia={featuredMedia} />
          
          {/* Modern UI Welcome Text Section */}
          <div className="px-6 py-12 text-center bg-[#0a0a0a] relative overflow-hidden">
            {/* Subtle background glow for modern depth */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#9f1239]/5 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 space-y-3">
              <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tighter text-white leading-tight">
                Welcome to <span className="text-[#9f1239] drop-shadow-[0_0_10px_rgba(159,18,57,0.3)]">Muvihub</span>
              </h2>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white/40 max-w-xs mx-auto">
                All Your VJs movies and series in one place
              </p>
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#9f1239]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#9f1239] shadow-[0_0_8px_rgba(159,18,57,0.8)]"></div>
                <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#9f1239]"></div>
              </div>
            </div>
          </div>
          
          <div className="px-5 mt-4">
            
            {/* Continue Watching Section */}
            {continueWatching.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-black flex items-center gap-3 flex-1 uppercase tracking-[0.2em] text-white/90">
                    Continue Watching
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                  </h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                  {continueWatching.map(m => (
                    <div key={m.id} className="flex-none w-[170px] sm:w-[210px]">
                      <MediaCard 
                        media={m} 
                        onClick={() => onMediaClick(m)} 
                        variant="landscape" 
                        downloadProgress={downloadProgress[m.id]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recently Added Section */}
            {recentlyAdded.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-black flex items-center gap-3 flex-1 uppercase tracking-[0.2em] text-white/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9f1239]"></span>
                    Recently Added
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                  </h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                  {recentlyAdded.map(m => (
                    <div key={m.id} className="flex-none w-[190px] sm:w-[230px]">
                      <MediaCard 
                        media={m} 
                        onClick={() => onMediaClick(m)} 
                        variant="landscape" 
                        downloadProgress={downloadProgress[m.id]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Movies Horizontal Section */}
            {movies.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-black flex items-center gap-3 flex-1 uppercase tracking-[0.2em] text-white/90">
                    Latest Movies
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                  </h2>
                  <button 
                    onClick={onMoviesSeeAll} 
                    className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black tracking-widest hover:border-[#9f1239] hover:bg-white/[0.08] transition-all whitespace-nowrap"
                  >
                    SEE ALL <i className="fas fa-chevron-right text-[6px]"></i>
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                  {movies.slice(0, 15).map(m => (
                    <div key={m.id} className="flex-none w-[120px] sm:w-[160px] md:w-[180px]">
                      <MediaCard 
                        media={m} 
                        onClick={() => onMediaClick(m)} 
                        downloadProgress={downloadProgress[m.id]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Series Horizontal Section */}
            {series.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-black flex items-center gap-3 flex-1 uppercase tracking-[0.2em] text-white/90">
                    Popular Series
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                  </h2>
                  <button 
                    onClick={onSeriesSeeAll} 
                    className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black tracking-widest hover:border-[#9f1239] hover:bg-white/[0.08] transition-all whitespace-nowrap"
                  >
                    SEE ALL <i className="fas fa-chevron-right text-[6px]"></i>
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                  {series.slice(0, 15).map(m => (
                    <div key={m.id} className="flex-none w-[120px] sm:w-[160px] md:w-[180px]">
                      <MediaCard 
                        media={m} 
                        onClick={() => onMediaClick(m)} 
                        downloadProgress={downloadProgress[m.id]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discover Pick Section */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black flex items-center gap-3 flex-1 uppercase tracking-[0.2em] text-white/90">
                  Discover Pick
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                </h2>
                <button 
                  onClick={onSeeAll} 
                  className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black tracking-widest hover:border-[#9f1239] hover:bg-white/[0.08] transition-all whitespace-nowrap"
                >
                  SEE ALL <i className="fas fa-chevron-right text-[6px]"></i>
                </button>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                {shuffledAll.slice(0, 24).map(m => (
                  <div key={m.id} className="flex-none w-[120px] sm:w-[160px] md:w-[180px]">
                    <MediaCard 
                      media={m} 
                      onClick={() => onMediaClick(m)} 
                      downloadProgress={downloadProgress[m.id]}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Category Groups */}
            {groupedContent.map((group) => (
              <div key={group.title} className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-black flex items-center gap-3 flex-1 uppercase tracking-[0.2em] text-white/90">
                    <i className={`${group.icon} text-[#9f1239] text-xs`}></i>
                    {group.title}
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                  </h2>
                  <button 
                    onClick={() => onGenreSeeAll(group.tags[0])} 
                    className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black tracking-widest hover:border-[#9f1239] hover:bg-white/[0.08] transition-all whitespace-nowrap"
                  >
                    SEE ALL <i className="fas fa-chevron-right text-[6px]"></i>
                  </button>
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                  {group.list.slice(0, 15).map(m => (
                    <div key={m.id} className="flex-none w-[120px] sm:w-[160px] md:w-[180px]">
                      <MediaCard 
                        media={m} 
                        onClick={() => onMediaClick(m)} 
                        downloadProgress={downloadProgress[m.id]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomeScreen;
