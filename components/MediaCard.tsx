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
  
  const posterUrl = media.tmdbData?.poster_path 
    ? getTMDBImageUrl(media.tmdbData.poster_path, 'w300') 
    : (media.poster || media.image || 'https://iili.io/KOR5eHX.png');

  const landscapeUrl = media.tmdbData?.backdrop_path
    ? getTMDBImageUrl(media.tmdbData.backdrop_path, 'w300')
    : (media.image || media.poster || 'https://iili.io/KOR5eHX.png');

  const imageUrl = variant === 'landscape' ? landscapeUrl : posterUrl;

  return (
    <div 
      onClick={onClick}
      className={`relative flex-none w-full rounded-lg overflow-hidden bg-[#141414] border border-[#2a2a2a] cursor-pointer group hover:scale-105 hover:border-[#9f1239] transition-all duration-300 shadow-lg ${variant === 'landscape' ? 'rounded-xl' : 'rounded-lg'}`}
    >
      {tags.length > 0 && variant === 'poster' && (
        <div className="absolute top-1 left-1 z-10 flex flex-wrap gap-0.5 max-w-[calc(100%-8px)]">
          {tags.slice(0, 1).map((t, i) => (
            <span key={i} className="bg-[#9f1239] text-white text-[7px] font-bold px-1 py-0.5 rounded-full shadow-lg uppercase truncate">#{t}</span>
          ))}
        </div>
      )}

      <div className={`relative w-full overflow-hidden ${variant === 'landscape' ? 'aspect-video' : 'aspect-[2/3]'}`}>
        {!loaded && <div className="absolute inset-0 skeleton"></div>}
        <img 
          src={imageUrl ?? 'https://iili.io/KOR5eHX.png'} 
          alt={media.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://iili.io/KOR5eHX.png'; setLoaded(true); }}
        />
        
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`${variant === 'landscape' ? 'w-8 h-8' : 'w-6 h-6'} bg-[#9f1239] rounded-full flex items-center justify-center text-white text-[8px]`}>
            <i className="fas fa-play ml-0.5"></i>
          </div>
        </div>
      </div>

      <div className={`p-1 bg-gradient-to-t from-black/95 to-transparent ${variant === 'landscape' ? 'pt-2' : ''}`}>
        <h3 className={`font-bold truncate leading-none ${variant === 'landscape' ? 'text-[10px]' : 'text-[9px]'}`}>{media.title}</h3>
        <p className="text-[7px] text-white/50 flex items-center gap-1 truncate mt-0.5">
          {media.genre}
        </p>
      </div>
      
      {variant === 'landscape' && (
        <div className="px-1.5 pb-1.5">
          <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-[#9f1239] w-[30%]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaCard;