
import React from 'react';

interface Props {
  active: string;
  onNavigate: (s: string) => void;
}

const BottomNav: React.FC<Props> = ({ active, onNavigate }) => {
  const items = [
    { id: 'home', label: 'Home', icon: 'fa-home' },
    { id: 'movies', label: 'Movies', icon: 'fa-film' },
    { id: 'series', label: 'Series', icon: 'fa-tv' },
    { id: 'downloads', label: 'Library', icon: 'fa-download' },
    { id: 'account', label: 'Account', icon: 'fa-user' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-[100] bg-black border-t border-white/10 flex justify-around p-2 shadow-2xl">
      {items.map(item => (
        <button 
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-1.5 flex-1 p-2 rounded-xl transition-all ${active === item.id ? 'text-white bg-[#9f1239]/10' : 'text-white/60 hover:text-white/80'}`}
        >
          <i className={`fas ${item.icon} text-lg ${active === item.id ? 'scale-110 text-[#9f1239]' : ''}`}></i>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${active === item.id ? 'opacity-100' : 'opacity-80'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
