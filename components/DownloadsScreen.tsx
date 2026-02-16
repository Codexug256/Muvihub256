
import React, { useState } from 'react';
import { Download } from '../types';
import { formatDate } from '../utils';

interface Props {
  downloads: Download[];
  onDelete: (id: string) => void;
}

const DownloadsScreen: React.FC<Props> = ({ downloads, onDelete }) => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="px-5 pt-20 pb-10">
      <h2 className="text-3xl font-black mb-8">My Library</h2>
      
      {downloads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-white/20">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-download text-4xl"></i>
          </div>
          <p className="text-xl font-bold text-white/40">No downloads yet</p>
          <p className="text-sm mt-2">Movies you download will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {downloads.map(item => (
            <div key={item.id} className={`flex items-center gap-4 p-4 bg-white/5 border rounded-2xl group transition-all ${item.success ? 'border-white/10 hover:border-[#9f1239]' : 'border-red-500/20'}`}>
              <div className="w-16 h-24 rounded-lg overflow-hidden flex-none relative bg-[#121212]">
                {!loadedImages[item.id] && (
                  <div className="absolute inset-0 skeleton"></div>
                )}
                {item.poster && (
                  <img 
                    src={item.poster} 
                    className={`w-full h-full object-cover transition-opacity duration-500 ${loadedImages[item.id] ? (item.success ? 'opacity-100' : 'opacity-40 grayscale') : 'opacity-0'}`} 
                    alt={item.title} 
                    loading="lazy"
                    onLoad={() => handleImageLoad(item.id)}
                  />
                )}
                {!item.success && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-exclamation-triangle text-red-500 text-sm"></i>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-lg truncate ${!item.success ? 'text-white/40' : ''}`}>{item.title}</h3>
                <p className="text-sm text-[#98a8c7]">{item.genre}</p>
                <p className="text-xs text-white/30 mt-1">
                  {item.success ? `Downloaded ${formatDate(item.downloadedAt)}` : `Failed: ${item.error || 'Unknown error'}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {item.success && (
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#9f1239] text-white shadow-lg hover:scale-105 transition-transform">
                    <i className="fas fa-play text-xs"></i>
                  </button>
                )}
                <button 
                  onClick={() => onDelete(item.id)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:border-red-500/30 transition-all"
                >
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadsScreen;
