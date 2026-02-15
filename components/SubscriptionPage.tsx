
import React from 'react';
import { Media } from '../types';

interface Props {
  onClose: () => void;
  onContinue: () => void;
  media: Media | null;
}

const SubscriptionPage: React.FC<Props> = ({ onClose, onContinue, media }) => {
  const plans = [
    { 
      title: 'Daily', 
      price: '1,500', 
      period: '24H', 
      icon: 'fa-bolt',
      url: 'https://pay.flexiicash.com/checkout/pay/1b884c40ee9f103b',
      featured: false,
      color: 'from-zinc-500/10'
    },
    { 
      title: 'Weekly', 
      price: '4,300', 
      period: '7D', 
      icon: 'fa-calendar-week',
      url: 'https://pay.flexiicash.com/checkout/pay/f0373dd610cd617f',
      featured: false,
      color: 'from-zinc-500/10'
    },
    { 
      title: '2 Weeks', 
      price: '6,500', 
      period: '14D', 
      icon: 'fa-calendar-alt',
      url: 'https://pay.flexiicash.com/checkout/pay/04b75dd52c1583ea',
      featured: false,
      color: 'from-zinc-500/10'
    },
    { 
      title: 'Monthly', 
      price: '9,500', 
      period: '30D', 
      icon: 'fa-crown',
      url: 'https://pay.flexiicash.com/checkout/pay/f06359ff3765b679',
      featured: true,
      color: 'from-[#9f1239]/40'
    },
  ];

  return (
    <div className="fixed inset-0 z-[4000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in overflow-hidden">
      <style>{`
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(159, 18, 57, 0.3); }
          50% { border-color: rgba(159, 18, 57, 1); }
        }
        .featured-pulse {
          animation: pulse-border 2s infinite ease-in-out;
        }
      `}</style>
      
      <div className="relative w-full max-w-[360px] bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#9f1239]/20 blur-[100px] rounded-full"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all z-20"
        >
          <i className="fas fa-times text-xs"></i>
        </button>

        <div className="relative z-10 p-7 flex flex-col items-center">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#9f1239]/10 border border-[#9f1239]/20 rounded-full mb-3">
              <i className="fas fa-crown text-[10px] text-[#9f1239]"></i>
              <span className="text-[#9f1239] text-[8px] font-black uppercase tracking-widest">Premium Access</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
              SELECT YOUR <span className="text-[#9f1239]">PASS</span>
            </h2>
            <p className="text-white/30 text-[7px] font-black uppercase tracking-[0.4em] mt-1">
              MTN & AIRTEL SUPPORTED
            </p>
          </div>

          {/* Grid Layout (2x2) */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {plans.map((plan, i) => (
              <button 
                key={i}
                onClick={() => window.location.href = plan.url}
                className={`group relative flex flex-col items-center p-5 rounded-[2rem] border transition-all duration-300 ${
                  plan.featured 
                    ? 'bg-gradient-to-br ' + plan.color + ' to-black border-[#9f1239] featured-pulse' 
                    : 'bg-white/[0.03] border-white/5 hover:border-white/20 active:scale-95'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#9f1239] text-white text-[6px] font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap">
                    Best Value
                  </span>
                )}
                
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  plan.featured ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40 group-hover:text-white transition-colors'
                }`}>
                  <i className={`fas ${plan.icon} text-sm`}></i>
                </div>

                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/90 mb-1">{plan.title}</h3>
                
                <div className="flex items-baseline gap-0.5">
                  <span className={`text-lg font-black ${plan.featured ? 'text-white' : 'text-white/80'}`}>{plan.price}</span>
                  <span className="text-[6px] font-black text-[#9f1239]">UGX</span>
                </div>
                
                <p className="text-[6px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">
                  {plan.period}
                </p>
              </button>
            ))}
          </div>

          {/* Payment Info Footer */}
          <div className="mt-8 flex flex-col items-center w-full">
            <div className="flex items-center gap-4 mb-4 opacity-60 grayscale hover:grayscale-0 transition-all">
              <img src="https://iili.io/q9xI9UJ.png" alt="Payment" className="h-4 object-contain" />
              <img src="https://iili.io/q9xzyla.jpg" alt="Payment" className="h-4 object-contain" />
            </div>
            
            <button 
              onClick={() => window.location.href = plans.find(p => p.featured)?.url || '#'}
              className="w-full py-4 bg-[#9f1239] rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-white shadow-[0_10px_30px_rgba(159,18,57,0.4)] hover:bg-[#be123c] transition-all flex items-center justify-center gap-2 group"
            >
              Get Unlimited Access
              <i className="fas fa-arrow-right text-[8px] group-hover:translate-x-1 transition-transform"></i>
            </button>
            
            <p className="text-white/20 text-[6px] font-bold uppercase tracking-[0.3em] mt-4">
              Secured by FlexiiCash
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
