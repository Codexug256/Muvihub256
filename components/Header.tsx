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
  onMyList: () => void;
  myListCount: number;
}

const Header: React.FC<Props> = ({ searchQuery, setSearchQuery, searchGenre, setSearchGenre, allMedia, onNotifications, newCount, onMyList, myListCount }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showGenreMenu, setShowGenreMenu] = useState(false);
  
  const genres = ['All', ...new Set(allMedia.map(m => m.genre).filter(Boolean))].sort();

  const handleGenreSelect = (g: string) => {
    setSearchGenre(g === 'All' ? '' : g);
    setShowGenreMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center px-5 h-[70px] bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden drop-shadow-lg">
            <img src="https://iili.io/f6WKiPV.png" alt="Logo" className="w-full h-auto object-cover" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Genre Toggle Icon */}
          <button 
            onClick={() => setShowGenreMenu(true)}
            className="w-10 h-10 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <i className="fas fa-layer-group text-sm"></i>
          </button>

          <button 
            onClick={onMyList} 
            className="relative w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <i className="fas fa-heart text-sm"></i>
            {myListCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E50914] text-[8px] w-4 h-4 flex items-center justify-center rounded-full border border-black font-black">
                {myListCount}
              </span>
            )}
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
              <span className="absolute -top-1 -right-1 bg-[#E50914] text-[8px] w-4 h-4 flex items-center justify-center rounded-full border border-black font-black">
                {newCount > 9 ? '9+' : newCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Genre Menu Overlay */}
      {showGenreMenu && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl animate-fade-in flex flex-col p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Explore Genres</h2>
            <button onClick={() => setShowGenreMenu(false)} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/80 hover:text-white transition-all">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {genres.map((g) => (
              <button
                key={g as string}
                onClick={() => handleGenreSelect(g as string)}
                className={`p-6 rounded-3xl text-sm font-black uppercase tracking-widest transition-all text-center border ${
                  (searchGenre === g || (g === 'All' && !searchGenre))
                    ? 'bg-[#E50914] text-white border-[#E50914] shadow-[0_10px_30px_rgba(229,9,20,0.3)] scale-105'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border-white/10'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {showSearch && (
        <div className="absolute top-0 left-0 w-full h-[70px] px-5 bg-black/95 backdrop-blur-3xl flex items-center gap-3 animate-slide-down">
          <input 
            type="text" 
            placeholder="Search titles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl focus:border-[#E50914] outline-none text-sm placeholder:text-white/40"
            autoFocus
          />
          <button onClick={() => setShowSearch(false)} className="w-11 h-11 flex items-center justify-center text-white/80 hover:text-[#E50914]">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;