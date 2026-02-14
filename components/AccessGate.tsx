
import React, { useState } from 'react';

interface Props {
  onUnlock: () => void;
  onGoToPremium: () => void;
  onClose: () => void;
}

const AccessGate: React.FC<Props> = ({ onUnlock, onGoToPremium, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'mrmuvihub') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-2xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#9f1239]/10 rounded-full blur-[40px]"></div>
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#9f1239]/10 rounded-full blur-[40px]"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
        >
          <i className="fas fa-times text-xs"></i>
        </button>

        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 mb-4 shadow-xl shadow-white/5">
          <img src="https://iili.io/f6WKiPV.png" alt="MuviHub Logo" className="w-full h-full object-contain" />
        </div>

        <h2 className="text-xl font-black uppercase tracking-tight mb-1">Premium Content</h2>
        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          Please input premium key
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-3 mb-6">
          <div className="relative">
            <input 
              type="password" 
              placeholder="ACCESS KEY"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white/5 border ${error ? 'border-red-500 animate-shake' : 'border-white/10'} rounded-2xl py-4 px-6 outline-none focus:border-[#9f1239] transition-all text-center text-[10px] font-black uppercase tracking-[0.3em] placeholder:text-white/20`}
            />
            {error && <p className="text-red-500 text-[8px] font-bold mt-2 uppercase tracking-widest">Invalid Premium Key</p>}
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-white/10 text-white text-[9px] font-black rounded-2xl uppercase tracking-[0.4em] hover:bg-white/20 transition-all border border-white/10"
          >
            Unlock Now
          </button>
        </form>

        <div className="w-full flex items-center gap-3 mb-6">
          <div className="h-[1px] flex-1 bg-white/5"></div>
          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">OR</span>
          <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>

        <button 
          onClick={onGoToPremium}
          className="w-full py-4 bg-[#9f1239] text-white text-[9px] font-black rounded-2xl uppercase tracking-[0.4em] shadow-lg hover:bg-[#be123c] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Get Premium Key <i className="fas fa-crown ml-2 text-[8px]"></i>
        </button>

        <p className="mt-6 text-[7px] font-black text-white/20 uppercase tracking-[0.4em]">Muvihub Ug Cinema</p>
      </div>
    </div>
  );
};

export default AccessGate;
