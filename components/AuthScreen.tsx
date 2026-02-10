
import React, { useState } from 'react';
import { auth, db } from '../services/firebase';

interface Props {
  showAuth: boolean;
  setShowAuth: (v: boolean) => void;
}

const AuthScreen: React.FC<Props> = ({ showAuth, setShowAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleForgotPassword = () => {
    window.location.href = "https://wa.me/256754310866?text=Hello%20MuviHub%20Support,%20I%20forgot%20my%20password.%20Could%20you%20please%20help%20me%20reset%20it?";
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#050505]">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-[#9f1239]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9f1239]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-10 sm:p-14 relative overflow-hidden shadow-2xl animate-fade-in">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 mb-6 drop-shadow-[0_0_15px_rgba(159,18,57,0.3)]">
            <img src="https://iili.io/f6WKiPV.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl font-black text-center uppercase tracking-tighter leading-none">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.5em] mt-3">MuviHub Cinema</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[9px] font-bold flex items-center gap-3 mb-8 uppercase tracking-widest animate-shake">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#9f1239] outline-none transition-all text-sm font-medium" 
                placeholder="Cinema Lover" 
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Email</label>
            <input 
              type="email" 
              required 
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#9f1239] outline-none transition-all text-sm font-medium" 
              placeholder="name@example.com" 
            />
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Password</label>
              {isLogin && (
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-[9px] font-black text-[#9f1239] uppercase tracking-widest hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative group">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#9f1239] outline-none transition-all text-sm font-medium pr-14" 
                placeholder="••••••••" 
                minLength={6}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#9f1239] transition-colors"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-[#9f1239] text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-[#be123c] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : (isLogin ? 'Enter Cinema' : 'Start Trial')}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
            {isLogin ? "No access yet?" : "Already a member?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-[#9f1239] font-black ml-3 hover:underline tracking-widest"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
