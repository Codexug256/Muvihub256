
import React from 'react';
import { Media } from '../types';

interface Props {
  onClose: () => void;
  onContinue: () => void; // Keeping for interface compatibility but focusing on individual plan selection
  media: Media | null;
}

const SubscriptionPage: React.FC<Props> = ({ onClose, onContinue, media }) => {
  const plans = [
    { 
      title: 'Daily Pass', 
      price: '1,500', 
      period: '24 Hours', 
      icon: 'fa-bolt', 
      popular: false,
      desc: 'Perfect for a movie night',
      url: 'https://pay.flexiicash.com/checkout/pay/1b884c40ee9f103b'
    },
    { 
      title: 'Weekly Pass', 
      price: '5,000', 
      period: '7 Days', 
      icon: 'fa-star', 
      popular: true,
      desc: 'Binge-watcher favorite',
      url: 'https://pay.flexiicash.com/checkout/pay/c8ff5fe36a636ea5'
    },
    { 
      title: 'Monthly Pass', 
      price: '15,000', 
      period: '30 Days', 
      icon: 'fa-heart', 
      popular: false,
      desc: 'Full month of translated hits',
      url: 'https://pay.flexiicash.com/checkout/pay/d1377f839858bb7d'
    },
    { 
      title: 'Yearly Access', 
      price: '45,000', 
      period: '365 Days', 
      icon: 'fa-crown', 
      popular: false,
      desc: 'The ultimate entertainment value',
      url: 'https://pay.flexiicash.com/checkout/pay/7435d0aab66aab6c'
    },
  ];

  const handlePlanSelect = (url: string) => {
    window.location.href = url;
  };

  const displayTitle = media 
    ? `Watch "${media.title}"`
    : 'MuviHub Premium';

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-3xl animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 sm:p-12 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] my-auto">
        {/* Visual Flair */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E50914]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-20"
        >
          <i className="fas fa-times text-lg"></i>
        </button>

        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#E50914] mb-8 shadow-xl">
            <i className="fas fa-crown"></i> Go Premium
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black mb-4 uppercase tracking-tighter drop-shadow-lg leading-tight">
            Choose Your Plan
          </h2>
          <p className="text-white/40 text-sm font-medium max-w-lg mx-auto leading-relaxed">
            {media 
              ? `You're one step away from watching "${media.title}". Choose a pass to unlock instant access to high-quality translated content.` 
              : 'Select a subscription plan that fits your entertainment lifestyle. Unlock unlimited movies, series, and high-speed downloads.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              onClick={() => handlePlanSelect(plan.url)}
              className={`relative flex flex-col p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 group hover:scale-[1.03] active:scale-[0.98] ${
                plan.popular 
                  ? 'bg-gradient-to-br from-[#E50914]/20 to-transparent border-[#E50914] shadow-[0_20px_50px_rgba(229,9,20,0.2)]' 
                  : 'bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.05]'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#E50914] text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">Best Value</div>
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${plan.popular ? 'bg-[#E50914] text-white shadow-[0_10px_20px_rgba(229,9,20,0.3)]' : 'bg-white/5 text-white/40 group-hover:text-white transition-colors'}`}>
                  <i className={`fas ${plan.icon}`}></i>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-3xl font-black">{plan.price}</span>
                    <span className="text-[10px] font-black text-white/20 uppercase">UGX</span>
                  </div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{plan.period}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-[#E50914] transition-colors">{plan.title}</h3>
                  <p className="text-[11px] font-bold text-white/30 uppercase tracking-wider">{plan.desc}</p>
                </div>
                
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase">
                    <i className="fas fa-check-circle text-[#E50914]"></i> Unlimited Streaming
                  </li>
                  <li className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase">
                    <i className="fas fa-check-circle text-[#E50914]"></i> High Quality Audio
                  </li>
                </ul>

                <button className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${plan.popular ? 'bg-[#E50914] text-white shadow-lg' : 'bg-white/5 border border-white/10 text-white/60 group-hover:bg-[#E50914] group-hover:text-white group-hover:border-[#E50914]'}`}>
                  Select {plan.title}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-white/5">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
               <i className="fas fa-shield-alt"></i>
             </div>
             <div>
               <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Secure Checkout</p>
               <p className="text-[8px] font-bold uppercase tracking-widest text-white/20">FlexiiCash Protected</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
               <i className="fas fa-infinity"></i>
             </div>
             <div>
               <p className="text-[9px] font-black uppercase tracking-widest text-white/60">No Commitments</p>
               <p className="text-[8px] font-bold uppercase tracking-widest text-white/20">Cancel anytime</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
