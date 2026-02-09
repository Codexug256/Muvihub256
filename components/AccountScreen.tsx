
import React from 'react';
import { UserProfile } from '../types';
import { formatDate } from '../utils';

interface Props {
  profile: UserProfile;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout: () => void;
  onBack: () => void;
  onManagePlan: () => void;
}

const AccountScreen: React.FC<Props> = ({ profile, onUpload, onLogout, onBack, onManagePlan }) => {
  const initial = (profile.displayName || profile.email || 'U')[0].toUpperCase();
  const avatarUrl = profile.photoURL || `https://ui-avatars.com/api/?name=${initial}&background=E50914&color=fff&size=200`;

  const daysLeft = profile.freeTrialEnd && profile.isFreeTrial 
    ? Math.max(0, Math.ceil((profile.freeTrialEnd - Date.now()) / (1000 * 60 * 60 * 24))) 
    : 0;

  const stats = [
    { label: 'Watched', val: '24', icon: 'fa-play', color: 'bg-blue-500' },
    { label: 'My List', val: '12', icon: 'fa-heart', color: 'bg-[#E50914]' },
    { label: 'Downloads', val: '5', icon: 'fa-download', color: 'bg-green-500' },
    { label: 'Streak', val: '3', icon: 'fa-fire', color: 'bg-orange-500' }
  ];

  return (
    <div className="px-5 pt-8 pb-24 max-w-4xl mx-auto space-y-8 animate-fade-in relative">
      {/* Modern Floating Back Button */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white/70 hover:text-white hover:bg-[#E50914] hover:border-[#E50914] transition-all shadow-xl group"
        >
          <i className="fas fa-chevron-left group-hover:-translate-x-1 transition-transform"></i>
        </button>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter">Account Info</h2>
          <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">MuviHub Settings</p>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-[#E50914]/10 rounded-full blur-[80px]"></div>
        
        <div className="relative flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full p-1.5 bg-gradient-to-tr from-[#E50914] to-[#ff4d4d] shadow-[0_0_30px_rgba(229,9,20,0.4)]">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#0a0a0a]">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <label className="absolute bottom-1 right-1 w-10 h-10 bg-[#E50914] text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all border-2 border-[#0a0a0a]">
              <i className="fas fa-camera text-sm"></i>
              <input type="file" className="hidden" onChange={onUpload} accept="image/*" />
            </label>
          </div>

          <div className="flex-1 space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase">{profile.displayName || 'Cinema Enthusiast'}</h1>
            <p className="text-white/40 font-bold tracking-wider">{profile.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                Member since {formatDate(profile.createdAt).split(',')[0]}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${profile.isFreeTrial ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'bg-[#E50914]/10 border-[#E50914]/30 text-[#E50914]'}`}>
                <i className="fas fa-crown"></i>
                {profile.isFreeTrial ? 'Free Trial' : 'Premium'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Status Card */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-[#E50914]/30 transition-all">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 text-2xl">
            <i className="fas fa-gem"></i>
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight">Current Plan: {profile.isFreeTrial ? 'Free Trial' : 'Premium Access'}</h3>
            <p className="text-white/40 text-xs font-medium">
              {profile.isFreeTrial 
                ? `Your trial ends in ${daysLeft} days. Upgrade for unlimited downloads.` 
                : 'Enjoy unlimited high-quality streaming and downloads.'}
            </p>
          </div>
        </div>
        <button 
          onClick={onManagePlan}
          className="px-8 py-4 bg-[#E50914] text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {profile.isFreeTrial ? 'Upgrade Now' : 'Manage Plan'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all text-center group">
            <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              <i className={`fas ${s.icon}`}></i>
            </div>
            <div className="text-3xl font-black mb-1">{s.val}</div>
            <div className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-3">
              <i className="fas fa-cog text-[#E50914]"></i> App Settings
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { label: 'Streaming Quality', value: '1080p (Auto)', icon: 'fa-tachometer-alt' },
              { label: 'Download Location', value: 'Internal Storage', icon: 'fa-folder' },
              { label: 'Dark Mode', value: 'Always On', icon: 'fa-moon' },
              { label: 'Notifications', value: 'Enabled', icon: 'fa-bell' }
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <i className={`fas ${item.icon} text-white/20 group-hover:text-white transition-colors`}></i>
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-[#E50914] uppercase">{item.value}</span>
                  <i className="fas fa-chevron-right text-[10px] text-white/20"></i>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-3">
              <i className="fas fa-shield-alt text-[#E50914]"></i> Security & Support
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { label: 'Privacy Policy', icon: 'fa-user-shield' },
              { label: 'Terms of Service', icon: 'fa-file-contract' },
              { label: 'Help Center', icon: 'fa-question-circle' },
              { label: 'Contact Support', icon: 'fa-headset' }
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <i className={`fas ${item.icon} text-white/20 group-hover:text-white transition-colors`}></i>
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                <i className="fas fa-chevron-right text-[10px] text-white/20"></i>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 flex flex-col gap-4">
        <button 
          onClick={onLogout}
          className="w-full py-5 bg-[#E50914] text-white font-black rounded-3xl text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
        >
          <i className="fas fa-sign-out-alt"></i> Sign Out Account
        </button>
        <p className="text-center text-white/20 text-[9px] font-black uppercase tracking-widest">MuviHub UG Version 4.2.0 • Made for entertainment</p>
      </div>
    </div>
  );
};

export default AccountScreen;
