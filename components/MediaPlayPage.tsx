
import React, { useState } from 'react';
import { Media } from '../types';
import { getTMDBImageUrl } from '../services/tmdb';
import MediaCard from './MediaCard';

interface Props {
  media: Media;
  onClose: () => void;
  onPlay: (m: Media) => void;
  onDownload: (m: Media) => void;
  downloadProgress?: number;
  episodes: Media[];
  recommended: Media[];
  onMediaClick: (m: Media) => void;
  isInList: boolean;
  onToggleList: (e: React.MouseEvent) => void;
}

const MediaPlayPage: React.FC<Props> = ({ media, onClose, onPlay, onDownload, downloadProgress, episodes, recommended, onMediaClick, isInList, onToggleList }) => {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [loadedCast, setLoadedCast] = useState<Record<string, boolean>>({});
  const logoUrl = "https://iili.io/f6WKiPV.png";

  const backdrop: string | undefined = (media.tmdbData?.backdrop_path 
    ? getTMDBImageUrl(media.tmdbData.backdrop_path, 'original') 
    : (media.image || media.poster || logoUrl)) || undefined;

  const seriesPoster: string | undefined = (media.tmdbData?.poster_path 
    ? getTMDBImageUrl(media.tmdbData.poster_path, 'w300') 
    : (media.poster || logoUrl)) || undefined;

  const synopsis = media.description || media.tmdbData?.overview || "This cinematic masterpiece is brought to you exclusively with Luganda commentary by the experts at MuviHub UG.";
  const cast = media.tmdbData?.credits?.cast?.slice(0, 15) || [];

  const handleMainPlay = () => {
    if (media.type === 'series' && episodes.length > 0) {
      onPlay(episodes[0]);
    } else {
      onPlay(media);
    }
  };

  const isDownloading = downloadProgress !== undefined;
  const appDownloadLink = "https://upload.app/download/MuviHub%20UG/com.digitalnest.ug/f758fd9ac3eb8c0933d34bf9bb05b91499fd8cbf8674831f5d26996f9a130652/downloading.";
  const whatsappJoinLink = "https://chat.whatsapp.com/Kofjdwlr2SWFhDpGOQIjiK?mode=gi_t";
  const telegramChannelLink = "https://t.me/muvihub256";

  const handleCastLoad = (id: string) => {
    setLoadedCast(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto pb-32 animate-fade-in no-scrollbar">
      <style>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(159, 18, 57, 0.7); transform: translate(-50%, -50%) scale(1); }
          70% { box-shadow: 0 0 0 20px rgba(159, 18, 57, 0); transform: translate(-50%, -50%) scale(1.05); }
          100% { box-shadow: 0 0 0 0 rgba(159, 18, 57, 0); transform: translate(-50%, -50%) scale(1); }
        }
        .play-emphasis {
          animation: pulse-glow 2s infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Hero Header */}
      <div className="relative h-[65vh] w-full bg-[#050505]">
        {/* Hero Skeleton (Logo removed) */}
        {!heroLoaded && (
          <div className="absolute inset-0 skeleton"></div>
        )}
        <div className="absolute inset-0">
          <img 
            src={backdrop} 
            className={`w-full h-full object-cover transition-opacity duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`} 
            alt={media.title} 
            onLoad={() => setHeroLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
          <button onClick={onClose} className="w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-[#9f1239] transition-all">
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={onToggleList}
              className={`w-10 h-10 flex items-center justify-center rounded-2xl border border-white/10 backdrop-blur-xl transition-all ${isInList ? 'bg-[#9f1239] text-white shadow-lg' : 'bg-black/40 text-white hover:bg-white/10'}`}
            >
              <i className={`fas ${isInList ? 'fa-check' : 'fa-plus'}`}></i>
            </button>
            <button 
              onClick={() => !isDownloading && onDownload(media)}
              className={`relative w-10 h-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl transition-all ${isDownloading ? 'cursor-default' : 'text-white hover:bg-white/20'}`}
            >
              {isDownloading ? (
                <>
                  <div className="absolute bottom-1 left-1 right-1 h-[2px] bg-[#9f1239] rounded-full" style={{ width: `${downloadProgress}%` }}></div>
                  <span className="text-[7px] font-black text-[#9f1239]">{downloadProgress}%</span>
                </>
              ) : (
                <i className="fas fa-download"></i>
              )}
            </button>
          </div>
        </div>

        <button 
          onClick={handleMainPlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 play-emphasis w-20 h-20 bg-[#9f1239] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20 group"
        >
          <i className="fas fa-play text-2xl ml-1 group-hover:scale-110 transition-transform"></i>
        </button>

        <div className="absolute bottom-8 left-0 w-full px-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-[#9f1239] text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shadow-lg">
              VJ TRANSLATED
            </span>
            <span className="text-white/80 font-black text-[9px] bg-white/5 px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10 uppercase tracking-widest">
              {media.genre}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] uppercase tracking-tighter px-4">
            {media.title}
          </h1>
        </div>
      </div>

      <div className="px-5 -mt-6 relative z-10 max-w-6xl mx-auto space-y-12">
        
        {/* Open Storyline (Synopsis) Section */}
        <section className="px-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black flex items-center gap-3 text-[#9f1239] uppercase tracking-[0.4em]">
              <i className="fas fa-align-left text-[10px]"></i> Storyline
            </h3>
            <div className="flex gap-2">
              <a 
                href={`https://wa.me/?text=Watch%20${encodeURIComponent(media.title)}%20on%20MuviHub%20UG.%20Download%20the%20app:%20${encodeURIComponent(appDownloadLink)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 hover:bg-[#9f1239] transition-all"
                title="Share via WhatsApp"
              >
                <i className="fas fa-share-nodes text-[10px]"></i>
              </a>
              <a 
                href={whatsappJoinLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-green-500/10 text-green-500 rounded-lg border border-green-500/20 hover:bg-green-500 hover:text-white transition-all"
                title="Join WhatsApp Channel"
              >
                <i className="fab fa-whatsapp text-sm"></i>
              </a>
              <a 
                href={telegramChannelLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all"
                title="Join Telegram Channel"
              >
                <i className="fab fa-telegram text-sm"></i>
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#9f1239] to-transparent opacity-50"></div>
            <p className="text-white/80 text-sm sm:text-lg leading-relaxed font-medium pl-6">
              {synopsis}
            </p>
          </div>
        </section>

        {/* Cast Section */}
        {cast.length > 0 && (
          <section className="px-2">
            <h3 className="text-[10px] font-black mb-6 flex items-center gap-3 text-[#9f1239] uppercase tracking-[0.4em]">
              <i className="fas fa-users text-[10px]"></i> Starring Cast
            </h3>
            <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
              {cast.map((actor: any) => (
                <div key={actor.id} className="flex-none w-14 sm:w-16 flex flex-col items-center group">
                  <div className="w-full aspect-square rounded-full overflow-hidden mb-3 border-2 border-white/5 group-hover:border-[#9f1239] transition-all duration-500 bg-white/5 relative">
                    {!loadedCast[actor.id] && (
                      <div className="absolute inset-0 skeleton" />
                    )}
                    <img 
                      src={getTMDBImageUrl(actor.profile_path, 'w185') || `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=141414&color=fff`} 
                      className={`w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ${loadedCast[actor.id] ? 'opacity-100' : 'opacity-0'}`}
                      alt={actor.name}
                      loading="lazy"
                      onLoad={() => handleCastLoad(actor.id)}
                    />
                  </div>
                  <h4 className="text-[7px] font-black text-white/50 group-hover:text-white transition-colors truncate w-full text-center uppercase tracking-widest leading-none">
                    {actor.name.split(' ')[0]}
                  </h4>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Episodes Section for Series */}
        {media.type === 'series' && episodes.length > 0 && (
          <section>
            <h3 className="text-[10px] font-black mb-6 flex items-center gap-3 text-[#9f1239] uppercase tracking-[0.4em] px-2">
              <i className="fas fa-list-ol text-[10px]"></i> Episodes
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-5 px-5">
              {episodes.map(ep => (
                <div 
                  key={ep.id} 
                  onClick={() => onPlay(ep)}
                  className="flex-none w-[260px] flex flex-col gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#9f1239]/40 hover:bg-white/[0.04] transition-all cursor-pointer group"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                    <div className="absolute inset-0 skeleton"></div>
                    <img 
                      src={ep.image ?? seriesPoster} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 relative z-10" 
                      alt={ep.title} 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <div className="w-10 h-10 bg-[#9f1239] rounded-full flex items-center justify-center text-white"><i className="fas fa-play text-xs"></i></div>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#9f1239] rounded text-[7px] font-black text-white uppercase z-20">
                      EPISODE {ep.episodeNumber}
                    </div>
                  </div>
                  <h4 className="font-black text-[11px] truncate uppercase text-white/90 group-hover:text-white">{ep.title}</h4>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Content */}
        {recommended.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8 px-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white whitespace-nowrap">You May Also Like</h3>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar -mx-5 px-5">
              {recommended.map(m => (
                <div key={m.id} className="flex-none w-28 sm:w-36">
                  <MediaCard media={m} onClick={() => onMediaClick(m)} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MediaPlayPage;
