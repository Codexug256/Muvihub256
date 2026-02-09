
import React, { useState } from 'react';
import { auth, db } from '../services/firebase';

interface Props {
  showAuth: boolean;
  setShowAuth: (v: boolean) => void;
}

const AuthScreen: React.FC<Props> = ({ showAuth, setShowAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (!showAuth) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await auth.signInWithEmailAndPassword(form.email, form.password);
      } else {
        const res = await auth.createUserWithEmailAndPassword(form.email, form.password);
        await db.ref(`users/${res.user?.uid}`).set({
          displayName: form.name,
          email: form.email,
          createdAt: Date.now(),
          isFreeTrial: true,
          freeTrialEnd: Date.now() + (30 * 24 * 60 * 60 * 1000)
        });
      }
      setShowAuth(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0a0a0a]">
      {/* Immersive Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#E50914]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#E50914]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-lg bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent opacity-50"></div>
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 mb-6 drop-shadow-[0_0_15px_rgba(229,9,20,0.5)]">
            <img src="https://iili.io/f6WKiPV.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-4xl font-black text-center uppercase tracking-tighter">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-2">MuviHub UG Entertainment</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[11px] font-bold flex items-center gap-3 mb-8 uppercase tracking-wider animate-shake">
            <i className="fas fa-exclamation-circle text-sm"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="group">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-[#E50914] transition-colors">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  required 
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:border-[#E50914] focus:bg-white/[0.08] outline-none transition-all text-sm font-medium" 
                  placeholder="Enter your name" 
                />
              </div>
            </div>
          )}

          <div className="group">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-[#E50914] transition-colors">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                required 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:border-[#E50914] focus:bg-white/[0.08] outline-none transition-all text-sm font-medium" 
                placeholder="example@mail.com" 
              />
            </div>
          </div>

          <div className="group">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-[#E50914] transition-colors">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required 
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:border-[#E50914] focus:bg-white/[0.08] outline-none transition-all text-sm font-medium" 
                placeholder="••••••••" 
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-[#E50914] text-white font-black rounded-2xl text-sm uppercase tracking-[0.2em] shadow-[0_15px_35px_rgba(229,9,20,0.3)] hover:bg-[#ff0a16] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : (isLogin ? 'Log In Securely' : 'Start Free Trial')}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-white/30 font-medium">
            {isLogin ? "New to MuviHub?" : "Already a member?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-[#E50914] font-black ml-2 uppercase text-xs tracking-widest hover:underline"
            >
              {isLogin ? 'Create Account' : 'Log In Instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
