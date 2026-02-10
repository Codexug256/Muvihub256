import React from 'react';
import { Media } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (genre: string) => void;
  allMedia: Media[];
}

const CategoriesModal: React.FC<Props> = ({ isOpen, onClose, onSelect, allMedia }) => {
  if (!isOpen) return null;

  const genres = [...new Set(allMedia.map(m => m.genre).filter(Boolean))].sort();

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0a0a0a]/95 backdrop-blur-3xl overflow-y-auto p-5 animate-slide-up">
      <div className="max-w-4xl mx-auto pt-10 pb-20">
        <div className="flex justify-between items-center mb-16">
          <div className="flex flex-col">
            <h2 className="text-4xl font-black flex items-center gap-4 tracking-tighter uppercase">
              <i className="fas fa-layer-group text-[#9f1239]"></i> Explore Genres
            </h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-2 ml-14">Find your next favorite story</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl hover:bg-[#9f1239] hover:border-[#9f1239] transition-all group"
          >
            <i className="fas fa-times group-hover:rotate-90 transition-transform"></i>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <button 
            onClick={() => { onSelect(''); onClose(); }}
            className="group relative flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:border-[#9f1239] hover:bg-[#9f1239]/5 transition-all"
          >
             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-[#9f1239] group-hover:scale-110 transition-transform">
                <i className="fas fa-th-large"></i>
             </div>
             <span className="font-black uppercase tracking-widest text-[10px] text-white/80 group-hover:text-white">All Content</span>
          </button>

          {genres.map(g => (
            <button 
              key={g} 
              onClick={() => { onSelect(g || ''); onClose(); }}
              className="group relative flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:border-[#9f1239] hover:bg-[#9f1239]/5 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-[#9f1239] group-hover:scale-110 transition-transform">
                <i className="fas fa-tag"></i>
              </div>
              <span className="font-black uppercase tracking-widest text-[10px] text-white/80 group-hover:text-white truncate w-full px-2">
                {g}
              </span>
              <div className="absolute top-4 right-4 text-[8px] font-black text-white/20">
                {allMedia.filter(m => m.genre === g).length}
              </div>
            </button>
          ))}
        </div>
        
        {genres.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-white/20">
            <i className="fas fa-search text-6xl mb-6"></i>
            <p className="text-xl font-black uppercase tracking-widest">No genres found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesModal;