
import React, { useState } from 'react';
import { Media } from '../types';
import { getTMDBImageUrl } from '../services/tmdb';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  list: Media[];
  onMediaClick: (m: Media) => void;
  onRemove: (id: string) => void;
}

const MyListScreen: React.FC<Props> = ({ isOpen, onClose, list, onMediaClick, onRemove }) => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0a0a0a] overflow-y-auto p-5 animate-slide-left">
      <div className="max-w-4xl mx-auto pt-10 pb-20">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black flex items-center gap-4">
            <i className="fas fa-heart text-[#9f1239]"></i> My List
          </h2>
          <button onClick={onClose} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl hover:bg-[#9f1239] transition-all">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-white/20">
            <i className="fas fa-heart-crack text-8xl mb-6"></i>
            <p className="text-2xl font-black">Your list is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {list.map(item => {
              const imageUrl = item.tmdbData?.poster_path 
                ? getTMDBImageUrl(item.tmdbData.poster_path, 'w300') 
                : (item.poster || item.image);
                
              return (
                <div key={item.id} className="relative group">
                  <div 
                    onClick={() => { onMediaClick(item); onClose(); }}
                    className="rounded-[1.5rem] overflow-hidden border border-white/10 cursor-pointer hover:border-[#9f1239] transition-all group-hover:-translate-y-2 shadow-2xl bg-[#141414] relative"
                  >
                    {!loadedImages[item.id] && (
                      <div className="absolute inset-0 skeleton"></div>
                    )}
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        className={`w-full h-[240px] object-cover transition-opacity duration-500 ${loadedImages[item.id] ? 'opacity-100' : 'opacity-0'}`} 
                        alt={item.title} 
                        loading="lazy"
                        onLoad={() => handleImageLoad(item.id)}
                      />
                    )}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                    className="absolute -top-2 -right-2 w-10 h-10 bg-[#9f1239] text-white rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListScreen;
