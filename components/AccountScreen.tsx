
import React from 'react';
import { UserProfile } from '../types';
import { formatDate } from '../utils';

interface Props {
  profile: UserProfile;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout: () => void;
}

const AccountScreen: React.FC<Props> = ({ profile, onUpload, onLogout }) => {
  const initial = (profile.displayName || profile.email || 'U')[0].toUpperCase();
  const avatarUrl = profile.photoURL || `https://ui-avatars.com/api/?name=${initial}&background=E50914&color=fff&size=200`;

  const daysLeft = profile.freeTrialEnd && profile.isFreeTrial 
    ? Math.max(0, Math.ceil((profile.freeTrialEnd - Date.now()) / (1000 * 60 * 60 * 24))) 
    : 0;

  return (
    <div className="px-5 pt-20 pb-10">
      <div className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl mb-10">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#E50914] shadow-2xl">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity">
            <i className="fas fa-camera text-2xl"></i>
            <input type="file" className="hidden" onChange={onUpload} accept="image/*" />
          </label>
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-black mb-1">{profile.displayName || 'User'}</h1>
          <p className="text-[#98a8c7] text-lg mb-4">{profile.email}</p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-lg ${profile.isFreeTrial ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30'}`}>
            <i className="fas fa-crown"></i>
            {profile.isFreeTrial ? `Free Trial - ${daysLeft} days left` : 'Premium Member'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          { label: 'Watched', val: '0', icon: 'fa-film' },
          { label: 'Favorites', val: '0', icon: 'fa-heart' },
          { label: 'Downloads', val: '0', icon: 'fa-download' },
          { label: 'Joined', val: formatDate(profile.createdAt).split(' ')[2] || 'N/A', icon: 'fa-clock' }
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-[#E50914] transition-colors">
            <div className="w-12 h-12 bg-[#E50914] flex items-center justify-center rounded-xl text-white shadow-lg">
              <i className={`fas ${s.icon}`}></i>
            </div>
            <div>
              <div className="text-2xl font-black">{s.val}</div>
              <div className="text-xs text-[#98a8c7] uppercase tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8 mb-10">
        {[
          { title: 'Account Settings', icon: 'fa-user-cog', items: ['Edit Profile', 'Privacy', 'Security'] },
          { title: 'Streaming', icon: 'fa-play-circle', items: ['Watch History', 'My List', 'Quality Settings'] }
        ].map((sec, i) => (
          <div key={i}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className={`fas ${sec.icon} text-[#E50914]`}></i> {sec.title}
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {sec.items.map((item, j) => (
                <button key={j} className="w-full flex justify-between items-center p-5 text-left hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors">
                  <span className="font-medium">{item}</span>
                  <i className="fas fa-chevron-right text-xs text-white/30"></i>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <button className="flex items-center justify-center gap-3 p-5 bg-green-500/10 border border-green-500/30 text-green-500 rounded-2xl font-bold hover:bg-green-500/20 transition-all">
          <i className="fas fa-headset"></i> 24/7 Support
        </button>
        <button onClick={onLogout} className="flex items-center justify-center gap-3 p-5 bg-[#ff4757] text-white rounded-2xl font-bold hover:bg-[#ff3742] shadow-xl hover:-translate-y-1 transition-all">
          <i className="fas fa-sign-out-alt"></i> Log Out
        </button>
      </div>
    </div>
  );
};

export default AccountScreen;
