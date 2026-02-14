
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
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl my-auto">
        
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#9f1239]/10 via-transparent to-transparent"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all z-20"
        >
          <i className="fas fa-times text-sm"></i>
        </button>

        <div className="relative z-10 p-8 pt-12 flex flex-col items-center">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-[#9f1239]/20 rounded-2xl blur-xl"></div>
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/5">
              <i className="fas fa-crown text-2xl text-[#9f1239]"></i>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-black uppercase tracking-tight mb-1">
              MuviHub <span className="text-[#9f1239]">Premium</span>
            </h2>
            <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.5em]">
              Unlimited Access in UGX
            </p>
          </div>

          <div className="w-full space-y-3">
            {plans.map((plan, i) => (
              <button 
                key={i}
                onClick={() => window.location.href = plan.url}
                className={`w-full group relative p-5 rounded-[2rem] flex items-center justify-between border transition-all duration-300 ${
                  plan.featured 
                    ? 'bg-gradient-to-br from-[#9f1239]/20 to-[#9f1239]/5 border-[#9f1239]' 
                    : 'bg-white/[0.03] border-white/5 hover:border-white/20'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#9f1239] rounded-full text-[7px] font-black uppercase tracking-widest text-white shadow-lg">
                    Best Value
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
                    plan.featured ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'
                  }`}>
                    <i className={`fas ${plan.icon}`}></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-black uppercase tracking-tight text-[11px] mb-0.5 text-white">{plan.title}</h3>
                    <p className={`text-[7px] font-bold uppercase tracking-widest ${plan.featured ? 'text-white/50' : 'text-white/30'}`}>
                      {plan.period} Access
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className={`text-lg font-black ${plan.featured ? 'text-white' : 'text-white/90'}`}>{plan.price}</span>
                    <span className="text-[7px] font-black uppercase text-[#9f1239]">UGX</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1.5 shadow-md">
                <img src="https://iili.io/q9xI9UJ.png" alt="Mastercard" className="w-full h-full object-contain" />
              </div>
              <div className="w-12 h-8 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1.5 shadow-md">
                <img src="https://iili.io/q9xzyla.jpg" alt="Visa" className="w-full h-full object-contain" />
              </div>
            </div>
            <p className="text-white/20 text-[7px] font-black uppercase tracking-[0.5em]">Mobile Money Accepted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
