
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
  
  // High Priority: Firebase/Local Assets
  const fbPoster = media.poster || media.image;
  const fbBackdrop = media.image || media.poster;

  // Fallback: TMDB Assets
  const tmdbPoster = getTMDBImageUrl(media.tmdbData?.poster_path, 'w300');
  const tmdbBackdrop = getTMDBImageUrl(media.tmdbData?.backdrop_path, 'w300');

  const primaryUrl = variant === 'landscape' 
    ? (fbBackdrop || tmdbBackdrop) 
    : (fbPoster || tmdbPoster);

  const isDownloading = downloadProgress !== undefined;

  return (
    <div 
      onClick={onClick}
      className="relative flex-none w-full cursor-pointer group transition-all duration-300"
    >
      {/* Image Container */}
      <div 
        className={`relative w-full overflow-hidden rounded-xl border border-white/5 bg-[#121212] group-hover:border-[#9f1239]/50 transition-all duration-300 shadow-xl flex items-center justify-center ${variant === 'landscape' ? 'aspect-video' : 'aspect-[2/3]'}`}
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
            className={`w-full h-full object-cover transition-opacity duration-500 group-hover:scale-110 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            loading="lazy"
            onError={(e) => { 
              const img = e.target as HTMLImageElement;
              // If current source is Firebase, try TMDB fallback
              if (img.src === fbPoster || img.src === fbBackdrop) {
                const fallback = variant === 'landscape' ? tmdbBackdrop : tmdbPoster;
                if (fallback) img.src = fallback;
                else setLoaded(true);
              } else {
                setLoaded(true); 
              }
            }}
          />
        )}
        
        {/* Download Progress Overlay */}
        {isDownloading && (
          <div className="absolute inset-0 z-30 bg-black/70 flex flex-col items-center justify-center p-3">
             <div className="w-10 h-10 border-2 border-white/10 border-t-[#9f1239] rounded-full animate-spin mb-2"></div>
             <span className="text-[10px] font-black text-[#9f1239] tracking-tighter">{downloadProgress}%</span>
             <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                <div 
                  className="h-full bg-[#9f1239] transition-all duration-300" 
                  style={{ width: `${downloadProgress}%` }}
                ></div>
             </div>
          </div>
        )}

        {/* Play Overlay (Only if not downloading) */}
        {!isDownloading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className={`${variant === 'landscape' ? 'w-10 h-10' : 'w-8 h-8'} bg-[#9f1239] rounded-full flex items-center justify-center text-white text-[10px] shadow-xl`}>
              <i className="fas fa-play ml-0.5"></i>
            </div>
          </div>
        )}

        {/* Media Tags */}
        {tags.length > 0 && variant === 'poster' && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-[#9f1239] text-white text-[6px] font-black px-1.5 py-0.5 rounded-md shadow-lg uppercase tracking-widest opacity-90">#{tags[0]}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="pt-2 px-0.5 flex flex-col gap-0.5">
        <h3 className={`font-black truncate uppercase tracking-tighter text-white/90 group-hover:text-white transition-colors ${variant === 'landscape' ? 'text-[10px]' : 'text-[9px]'}`}>
          {media.title}
        </h3>
        <p className="text-[7px] font-bold text-white/40 uppercase tracking-[0.15em] leading-none">
          {media.genre}
        </p>
      </div>
      
      {/* Progress Bar for Landscape */}
      {variant === 'landscape' && !isDownloading && (
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
