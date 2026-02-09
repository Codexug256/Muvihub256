
import React from 'react';
import { Media } from '../types';

interface Props {
  onClose: () => void;
  onContinue: () => void;
  media: Media | null;
}

const SubscriptionPage: React.FC<Props> = ({ onClose, onContinue, media }) => {
  const plans = [
    { title: 'Daily', price: '1,500', period: '24 Hours', icon: 'fa-bolt', popular: false },
    { title: 'Weekly', price: '5,000', period: '7 Days', icon: 'fa-star', popular: true },
    { title: 'Monthly', price: '15,000', period: '30 Days', icon: 'fa-heart', popular: false },
    { title: 'Yearly', price: '45,000', period: '365 Days', icon: 'fa-crown', popular: false },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5 bg-black/95 backdrop-blur-2xl animate-fade-in">
      <div className="w-full max-w-2xl bg-[#141414] border border-[#E50914]/30 rounded-[2.5rem] p-8 relative overflow-hidden shadow-[0_0_100px_rgba(229,9,20,0.2)]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#E50914] via-[#F40612] to-[#E50914]"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E50914] rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl animate-pulse">
            <i className="fas fa-crown text-2xl"></i>
          </div>
          
          <h2 className="text-3xl font-black mb-2">Premium Access Required</h2>
          <p className="text-[#98a8c7] text-sm leading-relaxed max-w-md mx-auto">
            Watching or downloading <span className="text-white font-bold">"{media?.title || 'this content'}"</span> requires an active subscription. Choose a plan that fits you best.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              onClick={onContinue}
              className={`relative p-5 rounded-3xl border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group ${
                plan.popular 
                  ? 'bg-[#E50914]/10 border-[#E50914] shadow-[0_10px_30px_rgba(229,9,20,0.2)]' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E50914] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Most Popular</span>
              )}
              <div className="flex flex-col items-center text-center">
                <i className={`fas ${plan.icon} text-lg mb-3 ${plan.popular ? 'text-[#E50914]' : 'text-white/40'}`}></i>
                <h3 className="text-lg font-black uppercase tracking-tighter mb-1">{plan.title}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-black">{plan.price}</span>
                  <span className="text-[10px] font-bold text-white/40 uppercase">UGX</span>
                </div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{plan.period}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={onContinue}
            className="w-full py-5 bg-[#E50914] text-white font-black rounded-2xl text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <i className="fas fa-lock-open"></i> UNLOCK ALL CONTENT
          </button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">
           <span className="flex items-center gap-2"><i className="fas fa-shield-alt text-[#E50914]"></i> SECURE PAYMENT</span>
           <span className="flex items-center gap-2"><i className="fas fa-infinity text-[#E50914]"></i> UNLIMITED ACCESS</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
