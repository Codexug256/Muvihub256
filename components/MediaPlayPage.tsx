
import React from 'react';
import { Media } from '../types';
import { getTMDBImageUrl } from '../services/tmdb';
import MediaCard from './MediaCard';

interface Props {
  media: Media;
  onClose: () => void;
  onPlay: (m: Media) => void;
  onDownload: (m: Media) => void;
  episodes: Media[];
  recommended: Media[];
  onMediaClick: (m: Media) => void;
  isInList: boolean;
  onToggleList: (e: React.MouseEvent) => void;
}

const MediaPlayPage: React.FC<Props> = ({ media, onClose, onPlay, onDownload, episodes, recommended, onMediaClick, isInList, onToggleList }) => {
  const backdrop = media.tmdbData?.backdrop_path 
    ? getTMDBImageUrl(media.tmdbData.backdrop_path, 'original') 
    : (media.image || media.poster || 'https://iili.io/KOR5eHX.png');

  const seriesPoster = media.tmdbData?.poster_path 
    ? getTMDBImageUrl(media.tmdbData.poster_path, 'w300') 
    : (media.poster || 'https://iili.io/KOR5eHX.png');

  const cast = media.tmdbData?.credits?.cast?.slice(0, 12) || [];

  const handleMainPlay = () => {
    if (media.type === 'series' && episodes.length > 0) {
      onPlay(episodes[0]);
    } else {
      onPlay(media);
    }
  };

  const apkShareLink = "https://www.mediafire.com/file/ta9wosmui025uoj/MuviHubUg.1.0.4.apk/file";
  const whatsappJoinLink = "https://chat.whatsapp.com/Kofjdwlr2SWFhDpGOQIjiK?mode=gi_t";
  const telegramChannelLink = "https://t.me/muvihub256";

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
        .episode-card:hover .episode-overlay {
          opacity: 1;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="relative h-[60vh] sm:h-[75vh] w-full">
        <div className="absolute inset-0">
          <img src={backdrop ?? 'https://iili.io/KOR5eHX.png'} className="w-full h-full object-cover" alt={media.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
        </div>

        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          <button onClick={onClose} className="w-10 h-10 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-[#9f1239] transition-all">
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={onToggleList}
              className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl border border-white/10 backdrop-blur-xl transition-all ${isInList ? 'bg-[#9f1239] text-white shadow-[0_0_15px_rgba(159,18,57,0.5)]' : 'bg-black/40 text-white hover:bg-white/10'}`}
            >
              <i className={`fas ${isInList ? 'fa-check' : 'fa-plus'}`}></i>
            </button>
            <button 
              onClick={() => onDownload(media)}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-white/20 transition-all"
            >
              <i className="fas fa-download"></i>
            </button>
          </div>
        </div>

        <button 
          onClick={handleMainPlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 play-emphasis w-20 h-20 sm:w-24 sm:h-24 bg-[#9f1239] text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(159,18,57,0.6)] hover:scale-110 active:scale-95 transition-all z-20 group"
        >
          <i className="fas fa-play text-2xl sm:text-3xl ml-1 group-hover:scale-110 transition-transform"></i>
        </button>

        <div className="absolute bottom-6 left-0 w-full px-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="bg-[#9f1239] text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.2em] shadow-lg">
              VJ TRANSLATED
            </span>
            <span className="text-white/80 font-black text-[9px] bg-white/5 px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10 uppercase tracking-widest">
              {media.genre}
            </span>
            {media.tmdbData?.vote_average && (
              <span className="text-yellow-500 font-black text-[9px] bg-white/5 px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10 flex items-center gap-1.5 uppercase tracking-widest">
                <i className="fas fa-star text-[8px]"></i> {media.tmdbData.vote_average.toFixed(1)}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-5xl font-black leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] uppercase tracking-tighter">
            {media.title}
          </h1>
        </div>
      </div>

      <div className="px-5 -mt-4 relative z-10 max-w-6xl mx-auto space-y-10">
        
        {/* Storyline Section */}
        <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black flex items-center gap-3 text-[#9f1239] uppercase tracking-[0.3em]">
              <i className="fas fa-align-left text-xs"></i> Storyline
            </h3>
            <div className="flex gap-2">
              <a href={`https://wa.me/?text=Watch%20${encodeURIComponent(media.title)}%20on%20MuviHub%20UG:%20${apkShareLink}`} target="_blank" className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 hover:bg-[#9f1239] transition-all"><i className="fas fa-share-nodes text-[10px]"></i></a>
              <a href={whatsappJoinLink} target="_blank" className="w-8 h-8 flex items-center justify-center bg-green-500/10 text-green-500 rounded-lg border border-green-500/20 hover:bg-green-500 hover:text-white transition-all"><i className="fab fa-whatsapp text-sm"></i></a>
            </div>
          </div>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed font-medium max-w-3xl">
            {media.description || media.tmdbData?.overview || "This cinematic masterpiece is brought to you exclusively with Luganda commentary by the experts at MuviHub UG."}
          </p>
        </section>

        {/* Cast Section - Refined with small circular icons */}
        {cast.length > 0 && (
          <section>
            <h3 className="text-sm font-black mb-6 flex items-center gap-3 text-[#9f1239] uppercase tracking-[0.3em] px-2">
              <i className="fas fa-users text-xs"></i> Starring Cast
            </h3>
            <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
              {cast.map((actor: any) => (
                <div key={actor.id} className="flex-none w-14 sm:w-16 flex flex-col items-center group">
                  <div className="w-full aspect-square rounded-full overflow-hidden mb-2 border-2 border-white/5 group-hover:border-[#9f1239] transition-all duration-500 bg-white/5 relative">
                    <img 
                      src={getTMDBImageUrl(actor.profile_path, 'w185') || `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=141414&color=fff`} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                      alt={actor.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h4 className="text-[7px] font-black text-white/60 group-hover:text-white transition-colors truncate w-full text-center uppercase tracking-widest">{actor.name.split(' ')[0]}</h4>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Episodes Section */}
        {media.type === 'series' && episodes.length > 0 && (
          <section>
            <h3 className="text-sm font-black mb-6 flex items-center gap-3 text-[#9f1239] uppercase tracking-[0.3em] px-2">
              <i className="fas fa-list text-xs"></i> Episodes List
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-5 px-5">
              {episodes.map(ep => (
                <div 
                  key={ep.id} 
                  onClick={() => onPlay(ep)}
                  className="episode-card flex-none w-[260px] sm:w-[300px] flex flex-col gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#9f1239]/30 hover:bg-white/[0.04] transition-all cursor-pointer group"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/5">
                    <img 
                      src={ep.image ?? (seriesPoster ?? 'https://iili.io/KOR5eHX.png')} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      alt={ep.title} 
                    />
                    <div className="episode-overlay absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-opacity duration-300">
                      <div className="w-10 h-10 bg-[#9f1239] rounded-full flex items-center justify-center text-white text-xs shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                        <i className="fas fa-play ml-0.5"></i>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#9f1239] rounded text-[7px] font-black text-white uppercase tracking-widest">
                      EPISODE {ep.episodeNumber}
                    </div>
                  </div>
                  <div className="px-1">
                    <h4 className="font-black text-[11px] truncate uppercase tracking-tight text-white/90 group-hover:text-white transition-colors">{ep.title}</h4>
                    <p className="text-white/40 text-[9px] line-clamp-2 leading-relaxed mt-1 h-7 font-medium">
                      {ep.description || "The saga continues in this expertly translated episode from MuviHub Uganda."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Section */}
        {recommended.length > 0 && (
          <section>
            <h3 className="text-sm font-black mb-8 flex items-center gap-4 uppercase tracking-[0.3em] px-2">
              <span className="text-white">Related</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
            </h3>
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
