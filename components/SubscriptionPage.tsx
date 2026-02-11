
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
      price: '2,000', 
      period: '24 Hours', 
      icon: 'fa-clock',
      url: 'https://pay.flexiicash.com/checkout/pay/ef26d3347ee78805',
      featured: false
    },
    { 
      title: 'Weekly Pass', 
      price: '5,000', 
      period: '7 Days', 
      icon: 'fa-calendar-week',
      url: 'https://pay.flexiicash.com/checkout/pay/c8ff5fe36a636ea5',
      featured: false
    },
    { 
      title: '2 Weeks Pass', 
      price: '7,500', 
      period: '14 Days', 
      icon: 'fa-calendar-alt',
      url: 'https://pay.flexiicash.com/checkout/pay/04b75dd52c1583ea',
      featured: false
    },
    { 
      title: 'Monthly Pass', 
      price: '15,000', 
      period: '30 Days', 
      icon: 'fa-crown',
      url: 'https://pay.flexiicash.com/checkout/pay/d1377f839858bb7d',
      featured: true
    },
  ];

  return (
    <div className="fixed inset-0 z-[4000] bg-[#050505]/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] my-auto">
        
        {/* Cinematic Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#9f1239]/20 via-transparent to-transparent"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-20"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="relative z-10 p-8 pt-16 flex flex-col items-center">
          {/* Replaced Logo with Crown Icon */}
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-[#9f1239]/20 rounded-[1.8rem] blur-2xl"></div>
            <div className="w-full h-full bg-white rounded-[1.8rem] flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.3)] ring-4 ring-white/5 transition-transform duration-700 hover:rotate-3">
              <i className="fas fa-crown text-3xl text-[#9f1239]"></i>
            </div>
          </div>
          
          <div className="text-center mb-8">
            {/* Reduced Text Size to Small (text-xl) */}
            <h2 className="text-xl font-black uppercase tracking-tighter mb-2 leading-none">
              MuviHub <span className="text-[#9f1239]">Premium</span>
            </h2>
            <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.5em]">
              Elevate Your Cinema Experience
            </p>
          </div>

          <div className="w-full space-y-3">
            {plans.map((plan, i) => (
              <button 
                key={i}
                onClick={() => window.location.href = plan.url}
                className={`w-full group relative p-5 rounded-[2rem] flex items-center justify-between border transition-all duration-300 ${
                  plan.featured 
                    ? 'bg-gradient-to-br from-[#9f1239]/30 to-[#9f1239]/5 border-[#9f1239] shadow-[0_10px_30px_rgba(159,18,57,0.2)]' 
                    : 'bg-white/[0.05] border-white/10 hover:border-white/30 hover:bg-white/[0.08]'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#9f1239] rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-lg border border-white/20">
                    Best Value
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base transition-colors ${
                    plan.featured ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'
                  }`}>
                    <i className={`fas ${plan.icon}`}></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-black uppercase tracking-tight text-sm leading-none mb-1 text-white group-hover:translate-x-1 transition-transform origin-left">{plan.title}</h3>
                    <p className={`text-[8px] font-bold uppercase tracking-widest ${plan.featured ? 'text-white/60' : 'text-white/30'}`}>
                      {plan.period} Unlimited
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className={`text-xl font-black ${plan.featured ? 'text-white' : 'text-white/90'}`}>{plan.price}</span>
                    <span className={`text-[8px] font-black uppercase ${plan.featured ? 'text-white/60' : 'text-white/30'}`}>UGX</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Optimized Footer with Specific White-Background Payment Icons */}
          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-2 shadow-xl transition-transform hover:scale-110 active:scale-95">
                <img src="https://iili.io/q9xI9UJ.png" alt="Mastercard" className="w-full h-full object-contain" />
              </div>
              <div className="w-14 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-2 shadow-xl transition-transform hover:scale-110 active:scale-95">
                <img src="https://iili.io/q9xzyla.jpg" alt="Visa" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
              Mobile Money Secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
