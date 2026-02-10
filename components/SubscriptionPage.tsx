
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
      icon: 'fa-bolt', 
      popular: false,
      features: ['24h Access', 'HD Streaming', 'Movies & Series'],
      url: 'https://pay.flexiicash.com/checkout/pay/1b884c40ee9f103b'
    },
    { 
      title: 'Weekly Pass', 
      price: '5,000', 
      period: '7 Days', 
      icon: 'fa-star', 
      popular: true,
      features: ['Offline Downloads', 'Full Series Access', 'Priority Support'],
      url: 'https://pay.flexiicash.com/checkout/pay/c8ff5fe36a636ea5'
    },
    { 
      title: 'Monthly Pass', 
      price: '15,000', 
      period: '30 Days', 
      icon: 'fa-heart', 
      popular: false,
      features: ['Unlimited Downloads', 'Luganda Dubs', 'No Ads'],
      url: 'https://pay.flexiicash.com/checkout/pay/d1377f839858bb7d'
    },
    { 
      title: 'Yearly Access', 
      price: '45,000', 
      period: '365 Days', 
      icon: 'fa-crown', 
      popular: false,
      features: ['Save 50% Yearly', '4K Ultra HD', 'Family Access'],
      url: 'https://pay.flexiicash.com/checkout/pay/7435d0aab66aab6c'
    },
  ];

  const handlePlanSelect = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-[#050505]/98 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-8 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-6xl bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 sm:p-14 relative overflow-hidden shadow-2xl my-auto">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#9f1239]/10 rounded-full blur-[140px]"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-[#9f1239] hover:border-[#9f1239] transition-all z-20"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Header Info */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#9f1239]/10 border border-[#9f1239]/20 text-[#9f1239] text-[10px] font-black uppercase tracking-[0.4em]">
                Premium Access
              </div>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-tight">
                Unlock <span className="text-[#9f1239]">Offline</span> Entertainment
              </h2>
              <p className="text-white/40 text-base font-medium max-w-sm">
                Get high-quality Luganda translated content. Download movies and full series to watch offline anytime.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { icon: 'fa-download', text: 'Download Movies & Series' },
                { icon: 'fa-tv', text: 'Full Box Sets Access' },
                { icon: 'fa-language', text: 'Professional Luganda Dubs' }
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-[#9f1239] transition-transform group-hover:scale-110">
                    <i className={`fas ${b.icon} text-sm`}></i>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-white/60">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                onClick={() => handlePlanSelect(plan.url)}
                className={`relative group p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 hover:scale-[1.02] active:scale-95 ${
                  plan.popular 
                    ? 'bg-[#9f1239] border-[#9f1239] shadow-2xl' 
                    : 'bg-white/[0.03] border-white/5 hover:border-[#9f1239]/50 hover:bg-[#9f1239]/5'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-white text-[#9f1239] text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">Best Value</div>
                )}
                
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${plan.popular ? 'bg-black/10 text-white' : 'bg-white/5 text-white/20'}`}>
                    <i className={`fas ${plan.icon}`}></i>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-2xl font-black">{plan.price}</span>
                      <span className={`text-[10px] font-bold ${plan.popular ? 'text-white/60' : 'text-white/20'}`}>UGX</span>
                    </div>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${plan.popular ? 'text-white/60' : 'text-white/30'}`}>{plan.period}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-black uppercase tracking-tight">{plan.title}</h3>
                    <ul className="space-y-1.5">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className={`text-[10px] font-bold flex items-center gap-2 ${plan.popular ? 'text-white/80' : 'text-white/40'}`}>
                          <i className={`fas fa-check-circle ${plan.popular ? 'text-white/40' : 'text-[#9f1239]'}`}></i> {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    plan.popular ? 'bg-white text-[#9f1239]' : 'bg-white/5 border border-white/10 group-hover:bg-[#9f1239] group-hover:text-white group-hover:border-[#9f1239]'
                  }`}>
                    Choose {plan.title}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-[9px] text-white/20 font-black uppercase tracking-[0.4em] pt-8 border-t border-white/5 relative z-10">
           <span><i className="fas fa-shield-alt mr-2 text-[#9f1239]"></i> SECURE PAYMENT</span>
           <span><i className="fas fa-download mr-2 text-[#9f1239]"></i> OFFLINE ACCESS</span>
           <span><i className="fas fa-undo mr-2 text-[#9f1239]"></i> CANCEL ANYTIME</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
