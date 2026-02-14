
import React, { useState } from 'react';
import { Media } from '../types';
import { getTMDBImageUrl } from '../services/tmdb';
import { extractTagsFromDescription } from '../utils';

interface Props {
  media: Media;
  onClick: () => void;
  showInfo?: boolean;
  variant?: 'poster' | 'landscape';
}

const MediaCard: React.FC<Props> = ({ media, onClick, showInfo = false, variant = 'poster' }) => {
  const [loaded, setLoaded] = useState(false);
  const tags = media.extractedTags || extractTagsFromDescription(media.description);
  
  const posterUrl: string | undefined = (media.tmdbData?.poster_path 
    ? getTMDBImageUrl(media.tmdbData.poster_path, 'w300') 
    : (media.poster || media.image || 'https://iili.io/KOR5eHX.png')) || undefined;

  const landscapeUrl: string | undefined = (media.tmdbData?.backdrop_path
    ? getTMDBImageUrl(media.tmdbData.backdrop_path, 'w300')
    : (media.image || media.poster || 'https://iili.io/KOR5eHX.png')) || undefined;

  const imageUrl = variant === 'landscape' ? landscapeUrl : posterUrl;

  return (
    <div 
      onClick={onClick}
      className="relative flex-none w-full cursor-pointer group transition-all duration-300"
    >
      {/* Image Container */}
      <div className={`relative w-full overflow-hidden rounded-xl border border-white/5 bg-[#111111] group-hover:border-[#9f1239]/50 transition-all duration-300 shadow-xl ${variant === 'landscape' ? 'aspect-video' : 'aspect-[2/3]'}`}>
        {!loaded && <div className="absolute inset-0 skeleton"></div>}
        <img 
          src={imageUrl ?? 'https://iili.io/KOR5eHX.png'} 
          alt={media.title}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://iili.io/KOR5eHX.png'; setLoaded(true); }}
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`${variant === 'landscape' ? 'w-10 h-10' : 'w-8 h-8'} bg-[#9f1239] rounded-full flex items-center justify-center text-white text-[10px] shadow-xl`}>
            <i className="fas fa-play ml-0.5"></i>
          </div>
        </div>

        {/* Media Tags overlaying image only */}
        {tags.length > 0 && variant === 'poster' && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-[#9f1239] text-white text-[6px] font-black px-1.5 py-0.5 rounded-md shadow-lg uppercase tracking-widest opacity-90">#{tags[0]}</span>
          </div>
        )}
      </div>

      {/* Content Section - Independent block below the image */}
      <div className="pt-2 px-0.5 flex flex-col gap-0.5">
        <h3 className={`font-black truncate uppercase tracking-tighter text-white/90 group-hover:text-white transition-colors ${variant === 'landscape' ? 'text-[10px]' : 'text-[9px]'}`}>
          {media.title}
        </h3>
        <p className="text-[7px] font-bold text-white/40 uppercase tracking-[0.15em] leading-none">
          {media.genre}
        </p>
      </div>
      
      {/* Progress Bar for Landscape (Continue Watching) */}
      {variant === 'landscape' && (
        <div className="mt-1.5 px-0.5">
          <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-[#9f1239] w-[35%] shadow-[0_0_8px_rgba(159,18,57,0.6)]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaCard;
