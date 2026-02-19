
import React, { useState } from 'react';
import { Media } from '../types';
import { getTMDBImageUrl } from '../services/tmdb';
import { extractTagsFromDescription } from '../utils';

interface Props {
  media: Media;
  onClick: () => void;
  showInfo?: boolean;
  variant?: 'poster' | 'landscape';
  downloadProgress?: number;
}

const MediaCard: React.FC<Props> = ({ media, onClick, variant = 'poster', downloadProgress }) => {
  const [loaded, setLoaded] = useState(false);
  const tags = media.extractedTags || extractTagsFromDescription(media.description);
  
  // High Priority: Firebase Storage Assets (Local Uploads)
  const fbPoster = media.poster || media.image;
  const fbBackdrop = media.image || media.poster;

  // Fallback: TMDB Assets
  const tmdbPoster = getTMDBImageUrl(media.tmdbData?.poster_path, 'w300');
  const tmdbBackdrop = getTMDBImageUrl(media.tmdbData?.backdrop_path, 'w300');

  // Logic: Always use Firebase Storage image if it exists, otherwise fall back to TMDB
  const primaryUrl = variant === 'landscape' 
    ? (fbBackdrop || tmdbBackdrop) 
    : (fbPoster || tmdbPoster);

  const isDownloading = downloadProgress !== undefined;

  return (
    <div 
      onClick={onClick}
      className="relative flex-none w-full cursor-pointer group transition-all duration-500 ease-out"
    >
      {/* Image Container */}
      <div 
        className={`relative w-full overflow-hidden rounded-2xl border border-white/5 bg-[#121212] group-hover:border-[#9f1239]/40 transition-all duration-500 shadow-2xl flex items-center justify-center ${variant === 'landscape' ? 'aspect-video' : 'aspect-[2/3]'}`}
      >
        {/* Skeleton Placeholder */}
        {!loaded && (
          <div className="absolute inset-0 skeleton"></div>
        )}

        {/* Media Image */}
        {primaryUrl && (
          <img 
            src={primaryUrl} 
            alt={media.title}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            loading="lazy"
            // @ts-ignore
            fetchpriority="high"
          />
        )}
        
        {/* Download Progress Overlay */}
        {isDownloading && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-3">
             <div className="w-8 h-8 border-2 border-white/10 border-t-[#9f1239] rounded-full animate-spin mb-2"></div>
             <span className="text-[9px] font-black text-white/90 tracking-tighter">{downloadProgress}%</span>
          </div>
        )}

        {/* Minimal Play Icon Overlay (Modern UI style) */}
        {!isDownloading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className={`w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500`}>
              <i className="fas fa-play text-[10px] ml-1"></i>
            </div>
          </div>
        )}

        {/* Content Badge */}
        {tags.length > 0 && variant === 'poster' && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="bg-black/40 backdrop-blur-md text-white/80 text-[6px] font-black px-2 py-1 rounded-lg border border-white/10 uppercase tracking-widest shadow-xl">
              #{tags[0]}
            </span>
          </div>
        )}
      </div>

      {/* Content Section - Simplified and Modernized */}
      <div className="pt-3 px-1 flex flex-col gap-0.5">
        <h3 className={`font-black truncate uppercase tracking-tighter text-white/80 group-hover:text-white transition-colors ${variant === 'landscape' ? 'text-[11px]' : 'text-[10px]'}`}>
          {media.title}
        </h3>
        <p className="text-[7px] font-bold text-white/30 uppercase tracking-[0.2em] leading-none">
          {media.genre}
        </p>
      </div>
      
      {/* Visual progress indicator for 'landscape' items (recently added/continue watching) */}
      {variant === 'landscape' && !isDownloading && (
        <div className="mt-2 px-1">
          <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-[#9f1239] w-[35%] shadow-[0_0_8px_rgba(159,18,57,0.4)]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaCard;
