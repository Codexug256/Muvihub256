import React, { useState } from 'react';
import { Media } from '../types';
import { getTMDBImageUrl } from '../services/tmdb';
import { extractTagsFromDescription } from '../utils';

interface Props {
  media: Media;
  onClick: () => void;
  showInfo?: boolean;
}

const MediaCard: React.FC<Props> = ({ media, onClick, showInfo = false }) => {
  const [loaded, setLoaded] = useState(false);
  const tags = media.extractedTags || extractTagsFromDescription(media.description);
  const imageUrl = media.tmdbData?.poster_path 
    ? getTMDBImageUrl(media.tmdbData.poster_path, 'w300') 
    : (media.poster || media.image || 'https://iili.io/KOR5eHX.png');

  return (
    <div 
      onClick={onClick}
      className="relative flex-none w-full rounded-lg overflow-hidden bg-[#141414] border border-[#2a2a2a] cursor-pointer group hover:scale-105 hover:border-[#E50914] transition-all duration-300 shadow-lg"
    >
      {tags.length > 0 && (
        <div className="absolute top-1 left-1 z-10 flex flex-wrap gap-0.5 max-w-[calc(100%-8px)]">
          {tags.slice(0, 1).map((t, i) => (
            <span key={i} className="bg-[#E50914] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg uppercase truncate">#{t}</span>
          ))}
        </div>
      )}

      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {!loaded && <div className="absolute inset-0 skeleton"></div>}
        <img 
          src={imageUrl || 'https://iili.io/KOR5eHX.png'} 
          alt={media.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://iili.io/KOR5eHX.png'; setLoaded(true); }}
        />
      </div>

      <div className="p-1.5 bg-gradient-to-t from-black/95 to-transparent">
        <h3 className="text-[10px] font-bold truncate leading-tight">{media.title}</h3>
        <p className="text-[8px] text-[#98a8c7] flex items-center gap-1 truncate mt-0.5">
          {media.genre}
        </p>
      </div>
    </div>
  );
};

export default MediaCard;