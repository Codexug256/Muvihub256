import React from 'react';
import { CATEGORY_GROUPS } from '../constants';
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
    <div className="fixed inset-0 z-[1000] bg-[#0a0a0a] overflow-y-auto p-5 animate-slide-up">
      <div className="max-w-4xl mx-auto pt-10 pb-20">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black flex items-center gap-4">
            <i className="fas fa-tags text-[#9f1239]"></i> Categories
          </h2>
          <button onClick={onClose} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl hover:bg-[#9f1239] transition-all">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {CATEGORY_GROUPS.map((group, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-[#9f1239]/50 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#9f1239] flex items-center justify-center rounded-2xl text-2xl text-white shadow-xl group-hover:scale-110 transition-transform">
                  <i className={group.icon}></i>
                </div>
                <h3 className="text-2xl font-black">{group.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.tags.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => { onSelect(tag); onClose(); }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-[#9f1239] hover:border-[#9f1239] transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-bold mb-6 text-white/40 uppercase tracking-[0.3em]">All Available Genres</h3>
        <div className="flex flex-wrap gap-3">
          {genres.map(g => (
            <button 
              key={g} 
              onClick={() => { onSelect(g || ''); onClose(); }}
              className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:border-[#9f1239] transition-all flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-[#9f1239]"></div> {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesModal;