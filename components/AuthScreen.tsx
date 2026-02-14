
import React, { useState } from 'react';
import { auth, db } from '../services/firebase';

interface Props {
  showAuth: boolean;
  setShowAuth: (v: boolean) => void;
}

type AuthMode = 'login' | 'signup' | 'reset';

const AuthScreen: React.FC<Props> = ({ showAuth, setShowAuth }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (!showAuth) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        await auth.signInWithEmailAndPassword(form.email, form.password);
        setShowAuth(false);
      } else if (mode === 'signup') {
        const res = await auth.createUserWithEmailAndPassword(form.email, form.password);
        await db.ref(`users/${res.user?.uid}`).set({
          displayName: form.name,
          email: form.email,
          createdAt: Date.now(),
          isFreeTrial: true,
          freeTrialEnd: Date.now() + (30 * 24 * 60 * 60 * 1000)
        });
        setShowAuth(false);
      } else if (mode === 'reset') {
        await handleForgotPassword();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      auth.languageCode = 'en'; 
      await auth.sendPasswordResetEmail(form.email);
      setSuccess(`Reset link sent to ${form.email}`);
      setTimeout(() => setMode('login'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'login') return 'Welcome Back';
    if (mode === 'signup') return 'Create Account';
    return 'Reset Access';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#050505]">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#9f1239]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#9f1239]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[420px] bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-8 sm:p-12 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] animate-fade-in">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#9f1239] rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 relative z-10 shadow-2xl ring-4 ring-white/5">
              <img src="https://iili.io/f6WKiPV.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-center uppercase tracking-tighter text-white leading-none mb-2">
            {getTitle()}
          </h2>
          <p className="text-[#9f1239] text-[8px] font-black uppercase tracking-[0.5em] text-center">
            Muvihub Ug Cinema
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[9px] font-black flex items-center gap-3 mb-6 uppercase tracking-widest animate-shake">
            <i className="fas fa-circle-exclamation text-xs"></i> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-2xl text-[9px] font-black flex items-center gap-3 mb-6 uppercase tracking-widest">
            <i className="fas fa-check-circle text-xs"></i> {success}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="relative group">
              <i className="fas fa-user absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#9f1239] transition-colors"></i>
              <input 
                type="text" 
                required 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 focus:border-[#9f1239] focus:bg-white/[0.08] outline-none transition-all text-sm font-medium placeholder:text-white/20" 
                placeholder="Your Full Name" 
              />
            </div>
          )}

          <div className="relative group">
            <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#9f1239] transition-colors"></i>
            <input 
              type="email" 
              required 
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 focus:border-[#9f1239] focus:bg-white/[0.08] outline-none transition-all text-sm font-medium placeholder:text-white/20" 
              placeholder="Email Address" 
            />
          </div>

          {mode !== 'reset' && (
            <div className="relative group">
              <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#9f1239] transition-colors"></i>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-14 focus:border-[#9f1239] focus:bg-white/[0.08] outline-none transition-all text-sm font-medium placeholder:text-white/20" 
                placeholder="Password" 
                minLength={6}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
              </button>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end px-1">
              <button 
                type="button" 
                onClick={() => setMode('reset')}
                className="text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-[#9f1239] transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-[#9f1239] text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.4em] shadow-[0_15px_30px_rgba(159,18,57,0.3)] hover:bg-[#be123c] hover:translate-y-[-2px] active:scale-95 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3 overflow-hidden relative"
          >
            {loading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <span className="relative z-10">
                {mode === 'login' ? 'Login' : (mode === 'signup' ? 'Join the Hub' : 'Reset My Access')}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </form>

        {/* Footer Actions */}
        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
            {mode === 'login' ? "New around here?" : mode === 'signup' ? "Already a member?" : "Back to basics?"}
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} 
              className="text-[#9f1239] font-black ml-3 hover:underline tracking-widest"
            >
              {mode === 'login' ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
