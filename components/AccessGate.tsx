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
    // Updated password from 'mrmuvihub' to 'mvh'
    if (password.toLowerCase() === 'mvh') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-[320px] bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 flex flex-col items-center text-center shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
        >
          <i className="fas fa-times text-[10px]"></i>
        </button>

        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2.5 mb-3 shadow-lg">
          <img src="https://iili.io/f6WKiPV.png" alt="MuviHub Logo" className="w-full h-full object-contain" />
        </div>

        <h2 className="text-lg font-black uppercase tracking-tight mb-0.5">Premium Content</h2>
        <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.2em] mb-5">
          Please input premium key
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-2.5 mb-5">
          <div className="relative">
            <input 
              type="password" 
              placeholder="ENTER KEY"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white/5 border ${error ? 'border-red-500 animate-shake' : 'border-white/10'} rounded-xl py-3 px-4 outline-none focus:border-[#9f1239] transition-all text-center text-[10px] font-black uppercase tracking-[0.3em] placeholder:text-white/20`}
            />
            {error && <p className="text-red-500 text-[7px] font-bold mt-1.5 uppercase tracking-widest">Invalid Key</p>}
          </div>
          <button 
            type="submit" 
            className="w-full py-3.5 bg-white/10 text-white text-[9px] font-black rounded-xl uppercase tracking-[0.4em] hover:bg-white/20 transition-all border border-white/10"
          >
            Unlock Now
          </button>
        </form>

        <div className="w-full flex items-center gap-2 mb-5">
          <div className="h-[1px] flex-1 bg-white/5"></div>
          <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">OR</span>
          <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>

        <button 
          onClick={onGoToPremium}
          className="w-full py-3.5 bg-[#9f1239] text-white text-[9px] font-black rounded-xl uppercase tracking-[0.4em] shadow-lg hover:bg-[#be123c] transition-all"
        >
          Get Premium Key
        </button>
      </div>
    </div>
  );
};

export default AccessGate;