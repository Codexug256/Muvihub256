import React, { useState } from 'react';
import { Media } from '../types';

interface Props {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchGenre: string;
  setSearchGenre: (g: string) => void;
  allMedia: Media[];
  onNotifications: () => void;
  newCount: number;
  onOpenCategories: () => void;
}

const Header: React.FC<Props> = ({ searchQuery, setSearchQuery, searchGenre, setSearchGenre, allMedia, onNotifications, newCount, onOpenCategories }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center px-5 h-[70px] bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden drop-shadow-lg">
            <img src="https://iili.io/f6WKiPV.png" alt="Logo" className="w-full h-auto object-cover" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Categories Toggle Icon */}
          <button 
            onClick={onOpenCategories}
            className="w-10 h-10 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <i className="fas fa-layer-group text-sm"></i>
          </button>
          
          <button 
            onClick={() => setShowSearch(!showSearch)} 
            className="w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <i className="fas fa-search text-sm"></i>
          </button>

          <button 
            onClick={onNotifications} 
            className="relative w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <i className="fas fa-bell text-sm"></i>
            {newCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#9f1239] text-[8px] w-4 h-4 flex items-center justify-center rounded-full border border-black font-black">
                {newCount > 9 ? '9+' : newCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="absolute top-0 left-0 w-full h-[70px] px-5 bg-black/95 backdrop-blur-3xl flex items-center gap-3 animate-slide-down">
          <input 
            type="text" 
            placeholder="Search titles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl focus:border-[#9f1239] outline-none text-sm placeholder:text-white/40"
            autoFocus
          />
          <button onClick={() => setShowSearch(false)} className="w-11 h-11 flex items-center justify-center text-white/80 hover:text-[#9f1239]">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;