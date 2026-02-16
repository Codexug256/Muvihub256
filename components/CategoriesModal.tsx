
import React from 'react';
import { Media } from '../types';
import { CATEGORY_GROUPS } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (genre: string) => void;
  allMedia: Media[];
}

const CategoriesModal: React.FC<Props> = ({ isOpen, onClose, onSelect, allMedia }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0a0a0a]/98 backdrop-blur-3xl overflow-y-auto p-5 animate-slide-up">
      <div className="max-w-xl mx-auto pt-16 pb-24">
        <div className="flex justify-between items-center mb-12">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black tracking-tighter uppercase text-white">
              Explore Genres
            </h2>
            <div className="h-1 w-12 bg-[#9f1239] mt-2 rounded-full"></div>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl hover:bg-[#9f1239] hover:border-[#9f1239] transition-all group"
          >
            <i className="fas fa-times group-hover:rotate-90 transition-transform"></i>
          </button>
        </div>

        <div className="space-y-3">
          {/* All Content Option */}
          <button 
            onClick={() => { onSelect(''); onClose(); }}
            className="w-full group flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-[#9f1239] hover:bg-[#9f1239]/5 transition-all"
          >
             <div className="flex items-center gap-5">
               <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#9f1239] group-hover:scale-110 transition-transform">
                  <i className="fas fa-th-large text-lg"></i>
               </div>
               <span className="font-black uppercase tracking-[0.2em] text-[11px] text-white/80 group-hover:text-white">All Collection</span>
             </div>
             <i className="fas fa-chevron-right text-[10px] text-white/20 group-hover:text-[#9f1239] transition-colors"></i>
          </button>

          {/* Category Groups for Simplified Navigation */}
          {CATEGORY_GROUPS.map(group => (
            <button 
              key={group.title} 
              onClick={() => { onSelect(group.title); onClose(); }}
              className="w-full group flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-[#9f1239] hover:bg-[#9f1239]/5 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#9f1239] group-hover:scale-110 transition-transform">
                  <i className={`${group.icon} text-lg`}></i>
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-black uppercase tracking-[0.2em] text-[11px] text-white/80 group-hover:text-white">
                    {group.title}
                  </span>
                  <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.1em] mt-0.5">
                    {allMedia.filter(m => 
                      m.genre && group.tags.some(tag => m.genre?.toLowerCase().includes(tag.toLowerCase()))
                    ).length} Titles Available
                  </span>
                </div>
              </div>
              <i className="fas fa-chevron-right text-[10px] text-white/20 group-hover:text-[#9f1239] transition-colors"></i>
            </button>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.5em]">Exclusive Luganda Commentary</p>
        </div>
      </div>
    </div>
  );
};

export default CategoriesModal;
