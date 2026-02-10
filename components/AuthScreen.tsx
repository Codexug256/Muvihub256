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
      setError('Please enter your email address to receive a reset link.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Apply requested language configuration (English is preferred for UG context)
      auth.languageCode = 'en'; 
      
      await auth.sendPasswordResetEmail(form.email);
      setSuccess(`A password reset link has been dispatched to ${form.email}. Please verify your inbox.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'login') return 'Sign In';
    if (mode === 'signup') return 'Join Us';
    return 'Reset Password';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#050505]">
      {/* Cinematic Background Decoration */}
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
            {getTitle()}
          </h2>
          <p className="text-white/50 text-[9px] font-black uppercase tracking-[0.5em] mt-3">MuviHub Cinema Experience</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[9px] font-bold flex items-center gap-3 mb-8 uppercase tracking-widest animate-shake">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-2xl text-[9px] font-bold flex items-center gap-3 mb-8 uppercase tracking-widest">
            <i className="fas fa-check-circle"></i> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#9f1239] outline-none transition-all text-sm font-medium" 
                placeholder="Enter your name" 
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-[#9f1239] outline-none transition-all text-sm font-medium" 
              placeholder="name@example.com" 
            />
          </div>

          {mode !== 'reset' && (
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <label className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">Password</label>
                  <span className="text-[8px] font-black text-[#9f1239] uppercase tracking-widest">6+ Characters</span>
                </div>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => setMode('reset')}
                    className="text-[9px] font-black text-[#9f1239] uppercase tracking-widest hover:underline disabled:opacity-50"
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
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#9f1239] transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-[#9f1239] text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-[#be123c] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
          >
            {loading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              mode === 'login' ? 'Enter Cinema' : (mode === 'signup' ? 'Get Access' : 'Send Reset Link')
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          {mode === 'reset' ? (
            <button 
              onClick={() => setMode('login')} 
              className="text-[10px] text-white/50 font-bold uppercase tracking-widest hover:text-[#9f1239] transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to Login
            </button>
          ) : (
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
              {mode === 'login' ? "New to MuviHub?" : "Already joined?"}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} 
                className="text-[#9f1239] font-black ml-3 hover:underline tracking-widest"
              >
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;