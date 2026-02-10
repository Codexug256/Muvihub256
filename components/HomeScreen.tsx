import React, { useMemo } from 'react';
import { Media } from '../types';
import MediaCard from './MediaCard';
import TMDBFeaturedCarousel from './TMDBFeaturedCarousel';
import { CATEGORY_GROUPS } from '../constants';

interface Props {
  allMedia: Media[];
  continueWatching: Media[];
  mediaByGenre: Record<string, Media[]>;
  onMediaClick: (m: Media) => void;
  isSearching: boolean;
  onSeeAll: () => void;
  onGenreSeeAll: (g: string) => void;
  clearFilters: () => void;
}

const HomeScreen: React.FC<Props> = ({ allMedia, continueWatching, mediaByGenre, onMediaClick, isSearching, onSeeAll, onGenreSeeAll, clearFilters }) => {
  
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
              <span className="text-white/60 text-lg font-normal">({allMedia.length})</span>
            </h2>
            <button onClick={clearFilters} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold hover:border-[#9f1239]">
              <i className="fas fa-times mr-2"></i> Clear
            </button>
          </div>
          {/* Increased search result columns for smaller cards */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-2">
            {allMedia.map(m => (
              <MediaCard key={m.id} media={m} onClick={() => onMediaClick(m)} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <TMDBFeaturedCarousel onMovieClick={onMediaClick} />
          
          <div className="px-5 mt-12">
            
            {/* Continue Watching Section */}
            {continueWatching.length > 0 && (
              <div className="mb-16">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black flex items-center gap-4 flex-1 uppercase tracking-tighter">
                    Continue Watching
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#9f1239] to-transparent"></div>
                  </h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar -mx-5 px-5">
                  {continueWatching.map(m => (
                    <div key={m.id} className="flex-none w-[160px] sm:w-[200px]">
                      <MediaCard media={m} onClick={() => onMediaClick(m)} variant="landscape" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New & Trending Section - Showing 24 items (3 rows on lg:grid-cols-8) */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black flex items-center gap-4 flex-1 uppercase tracking-tighter">
                New & Trending
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#9f1239] to-transparent"></div>
              </h2>
              <button 
                onClick={onSeeAll} 
                className="ml-4 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest hover:border-[#9f1239] transition-all whitespace-nowrap"
              >
                SEE ALL <i className="fas fa-chevron-right text-[7px]"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-16">
              {allMedia.slice(0, 24).map(m => (
                <MediaCard key={m.id} media={m} onClick={() => onMediaClick(m)} />
              ))}
            </div>

            {/* Rendered Category Groups - Each group shows 3 rows (24 items for 8 columns) */}
            {groupedContent.map((group) => (
              <div key={group.title} className="mb-16">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black flex items-center gap-4 flex-1 uppercase tracking-tighter">
                    <i className={`${group.icon} text-[#9f1239] text-sm`}></i>
                    {group.title}
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#9f1239] to-transparent"></div>
                  </h2>
                  <button 
                    onClick={() => onGenreSeeAll(group.tags[0])} 
                    className="ml-4 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest hover:border-[#9f1239] transition-all whitespace-nowrap"
                  >
                    SEE ALL <i className="fas fa-chevron-right text-[7px]"></i>
                  </button>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {group.list.slice(0, 24).map(m => (
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