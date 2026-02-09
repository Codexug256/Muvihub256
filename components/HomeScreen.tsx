
import React, { useMemo } from 'react';
import { Media } from '../types';
import MediaCard from './MediaCard';
import TMDBFeaturedCarousel from './TMDBFeaturedCarousel';
import { CATEGORY_GROUPS } from '../constants';

interface Props {
  allMedia: Media[];
  mediaByGenre: Record<string, Media[]>;
  onMediaClick: (m: Media) => void;
  isSearching: boolean;
  onSeeAll: () => void;
  onGenreSeeAll: (g: string) => void;
  clearFilters: () => void;
}

const HomeScreen: React.FC<Props> = ({ allMedia, mediaByGenre, onMediaClick, isSearching, onSeeAll, onGenreSeeAll, clearFilters }) => {
  
  // Group media by Category Groups defined in constants.tsx to avoid duplication and honor "Fantasy" request
  const groupedContent = useMemo(() => {
    return CATEGORY_GROUPS.map(group => {
      const filtered = allMedia.filter(m => 
        m.genre && group.tags.some(tag => m.genre?.toLowerCase().includes(tag.toLowerCase()))
      );
      return { ...group, list: filtered };
    }).filter(g => g.list.length > 0);
  }, [allMedia]);

  return (
    <div className="pb-10">
      {isSearching ? (
        <div className="px-5 pt-24">
          <div className="flex justify-between items-center my-6">
            <h2 className="text-2xl font-extrabold flex items-center gap-3">
              Search Results
              <span className="text-white/40 text-lg font-normal">({allMedia.length})</span>
            </h2>
            <button onClick={clearFilters} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold hover:border-[#E50914]">
              <i className="fas fa-times mr-2"></i> Clear
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {allMedia.map(m => (
              <MediaCard key={m.id} media={m} onClick={() => onMediaClick(m)} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <TMDBFeaturedCarousel onMovieClick={onMediaClick} />
          
          <div className="px-5 mt-12">
            {/* New & Trending Section */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black flex items-center gap-4 flex-1 uppercase tracking-tighter">
                New & Trending
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#E50914] to-transparent"></div>
              </h2>
              <button 
                onClick={onSeeAll} 
                className="ml-4 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest hover:border-[#E50914] transition-all whitespace-nowrap"
              >
                SEE ALL <i className="fas fa-chevron-right text-[7px]"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-16">
              {allMedia.slice(0, 16).map(m => (
                <MediaCard key={m.id} media={m} onClick={() => onMediaClick(m)} />
              ))}
            </div>

            {/* Rendered Category Groups (Handles Fantasy separately as requested) */}
            {groupedContent.map((group) => (
              <div key={group.title} className="mb-16">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black flex items-center gap-4 flex-1 uppercase tracking-tighter">
                    <i className={`${group.icon} text-[#E50914] text-sm`}></i>
                    {group.title}
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#E50914] to-transparent"></div>
                  </h2>
                  <button 
                    onClick={() => onGenreSeeAll(group.tags[0])} 
                    className="ml-4 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest hover:border-[#E50914] transition-all whitespace-nowrap"
                  >
                    SEE ALL <i className="fas fa-chevron-right text-[7px]"></i>
                  </button>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {group.list.slice(0, 16).map(m => (
                    <MediaCard key={m.id} media={m} onClick={() => onMediaClick(m)} />
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
