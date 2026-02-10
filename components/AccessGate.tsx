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
    if (password.toLowerCase() === 'dydx') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-in">
      <div className="relative w-full max-md bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center shadow-2xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#9f1239]/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#9f1239]/10 rounded-full blur-[80px]"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center p-5 mb-8 shadow-xl shadow-white/5 animate-bounce-slow">
          <img src="https://iili.io/f6WKiPV.png" alt="MuviHub Logo" className="w-full h-full object-contain" />
        </div>

        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Content Gated</h2>
        <p className="text-white/80 text-sm font-medium mb-10 leading-relaxed">
          Premium content requires a subscription or an access key to proceed.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4 mb-8">
          <div className="relative">
            <input 
              type="password" 
              placeholder="Enter Access Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-white/5 border ${error ? 'border-red-500 animate-shake' : 'border-white/10'} rounded-2xl py-5 px-6 outline-none focus:border-[#9f1239] transition-all text-center text-sm font-black uppercase tracking-[0.2em] placeholder:text-white/20`}
            />
            {error && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-widest">Invalid Key</p>}
          </div>
          <button 
            type="submit"
            className="w-full py-5 bg-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-white/20 transition-all border border-white/10"
          >
            Unlock Now
          </button>
        </form>

        <div className="w-full flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-white/10"></div>
          <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">OR</span>
          <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>

        <button 
          onClick={onGoToPremium}
          className="w-full py-5 bg-[#9f1239] text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-[#be123c] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Go Premium <i className="fas fa-crown ml-2"></i>
        </button>

        <p className="mt-8 text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">MuviHub UG Pro Max Security</p>
      </div>
    </div>
  );
};

export default AccessGate;