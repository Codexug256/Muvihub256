
import React from 'react';
import { Download } from '../types';
import { formatDate } from '../utils';

interface Props {
  downloads: Download[];
  onDelete: (id: string) => void;
}

const DownloadsScreen: React.FC<Props> = ({ downloads, onDelete }) => {
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
            <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-[#E50914] transition-all">
              <div className="w-16 h-24 rounded-lg overflow-hidden flex-none">
                <img src={item.poster || 'https://iili.io/KOR5eHX.png'} className="w-full h-full object-cover" alt={item.title} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">{item.title}</h3>
                <p className="text-sm text-[#98a8c7]">{item.genre}</p>
                <p className="text-xs text-white/30 mt-1">Downloaded {formatDate(item.downloadedAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#E50914] text-white shadow-lg">
                  <i className="fas fa-play text-xs"></i>
                </button>
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
