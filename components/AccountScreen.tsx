
import React from 'react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout: () => void;
  onBack: () => void;
  onManagePlan: () => void;
}

const AccountScreen: React.FC<Props> = ({ profile, onUpload, onLogout, onBack, onManagePlan }) => {
  const initial = (profile.displayName || profile.email || 'U')[0].toUpperCase();
  const avatarUrl = profile.photoURL || `https://ui-avatars.com/api/?name=${initial}&background=9f1239&color=fff&size=200`;

  const handleHelpCenter = () => {
    window.location.href = "https://wa.me/256754310866?text=Hello%20MuviHub%20Support,%20I%20need%20assistance%20with%20my%20account.";
  };

  return (
    <div className="min-h-screen px-6 pt-12 pb-32 max-w-lg mx-auto animate-fade-in bg-[#050505]">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"
        >
          <i className="fas fa-arrow-left text-sm"></i>
        </button>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/60">My Profile</h2>
        <div className="w-10"></div>
      </div>

      {/* Hero Profile Section */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="relative group mb-6">
          <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-[#9f1239]/50 p-1 bg-gradient-to-tr from-[#9f1239]/20 to-transparent">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-[1.8rem]" />
          </div>
          <label className="absolute -bottom-1 -right-1 w-9 h-9 bg-[#9f1239] text-white rounded-xl flex items-center justify-center cursor-pointer shadow-xl border-[3px] border-[#050505] hover:scale-110 transition-transform">
            <i className="fas fa-pencil text-[10px]"></i>
            <input type="file" className="hidden" onChange={onUpload} accept="image/*" />
          </label>
        </div>
        <h1 className="text-2xl font-black tracking-tighter uppercase mb-1">{profile.displayName || 'Cinema Lover'}</h1>
        <p className="text-white/20 text-[9px] font-black tracking-[0.4em] uppercase">{profile.email}</p>
      </div>

      {/* Subscription Quick Access */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 mb-8 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#9f1239]/10 flex items-center justify-center text-[#9f1239]">
            <i className="fas fa-crown text-sm"></i>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#9f1239]">Status</p>
            <h3 className="text-sm font-black uppercase tracking-tight text-white/80">
              {profile.isFreeTrial ? 'Free Trial' : 'Premium Member'}
            </h3>
          </div>
        </div>
        <button 
          onClick={onManagePlan}
          className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#9f1239] hover:border-[#9f1239] transition-all"
        >
          Change
        </button>
      </div>

      {/* Essential Menu */}
      <div className="space-y-2 mb-10">
        <button 
          onClick={handleHelpCenter}
          className="w-full flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#9f1239]/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <i className="fab fa-whatsapp text-lg text-green-500/50 group-hover:text-green-500 transition-colors"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white">Help Center</span>
          </div>
          <i className="fas fa-external-link-alt text-[9px] text-white/10"></i>
        </button>

        <button className="w-full flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/20 transition-all group">
          <div className="flex items-center gap-4">
            <i className="fas fa-sliders-h text-lg text-white/20 group-hover:text-[#9f1239] transition-colors"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white">Preferences</span>
          </div>
          <i className="fas fa-chevron-right text-[9px] text-white/10"></i>
        </button>
      </div>

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="w-full py-5 bg-[#9f1239]/5 border border-[#9f1239]/10 text-[#9f1239] font-black rounded-2xl text-[9px] uppercase tracking-[0.5em] hover:bg-[#9f1239] hover:text-white transition-all flex items-center justify-center gap-3"
      >
        <i className="fas fa-sign-out-alt text-xs"></i> Logout Account
      </button>

      <p className="mt-12 text-center text-white/10 text-[7px] font-black uppercase tracking-[0.6em]">MuviHub Uganda • Digital Premier</p>
    </div>
  );
};

export default AccountScreen;
