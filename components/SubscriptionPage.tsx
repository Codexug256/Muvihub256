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
      title: 'Daily Pass', 
      price: '1,500', 
      period: '24 Hours', 
      url: 'https://pay.flexiicash.com/checkout/pay/1b884c40ee9f103b',
      featured: false
    },
    { 
      title: 'Weekly Pass', 
      price: '5,000', 
      period: '7 Days', 
      url: 'https://pay.flexiicash.com/checkout/pay/c8ff5fe36a636ea5',
      featured: false
    },
    { 
      title: 'Monthly Pass', 
      price: '15,000', 
      period: '30 Days', 
      url: 'https://pay.flexiicash.com/checkout/pay/d1377f839858bb7d',
      featured: true
    },
  ];

  return (
    <div className="fixed inset-0 z-[4000] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#E50914]/20 to-transparent"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white z-20"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="relative z-10 p-10 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#E50914] rounded-3xl flex items-center justify-center text-2xl mb-6 shadow-xl shadow-[#E50914]/30">
            <i className="fas fa-crown"></i>
          </div>
          
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
            MuviHub <span className="text-[#E50914]">Premium</span>
          </h2>
          
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
            Choose Your Access Plan
          </p>

          <div className="w-full space-y-3">
            {plans.map((plan, i) => (
              <button 
                key={i}
                onClick={() => window.location.href = plan.url}
                className={`w-full group p-5 rounded-[2rem] flex items-center justify-between border-2 transition-all ${
                  plan.featured 
                    ? 'bg-[#E50914] border-[#E50914] shadow-xl' 
                    : 'bg-white/5 border-white/10 hover:border-[#E50914]/50'
                }`}
              >
                <div className="text-left">
                  <h3 className="font-black uppercase tracking-tight text-base leading-none mb-1">{plan.title}</h3>
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${plan.featured ? 'text-white/60' : 'text-white/20'}`}>
                    {plan.period} Access
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black">{plan.price}</span>
                  <span className="text-[9px] ml-1 font-bold opacity-50 uppercase">UGX</span>
                </div>
              </button>
            ))}
          </div>

          <p className="mt-10 text-[8px] font-black uppercase tracking-[0.5em] text-white/10">
            Professional Luganda Dubs • Offline Mode
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;