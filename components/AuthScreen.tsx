
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5 bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-md bg-[#141414] border border-[#E50914]/30 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E50914] to-[#ff4d4d]"></div>
        
        <h2 className="text-3xl font-black text-center mb-8 relative">
          {isLogin ? 'Welcome Back 🍿' : 'Join MuviHub 🎬'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-sm flex items-center gap-3 mb-6">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white/60 ml-1">Full Name</label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-white/30"></i>
                <input 
                  type="text" 
                  required 
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-5 focus:border-[#E50914] outline-none" 
                  placeholder="John Doe" 
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-white/60 ml-1">Email</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-white/30"></i>
              <input 
                type="email" 
                required 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-5 focus:border-[#E50914] outline-none" 
                placeholder="email@example.com" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-white/60 ml-1">Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/30"></i>
              <input 
                type="password" 
                required 
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-5 focus:border-[#E50914] outline-none" 
                placeholder="••••••" 
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-[#E50914] text-white font-black rounded-xl hover:bg-[#ff0a16] shadow-xl shadow-[#E50914]/20 transition-all disabled:opacity-50"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : (isLogin ? 'LOG IN' : 'SIGN UP')}
          </button>
        </form>

        <p className="text-center text-sm text-white/50 mt-8">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#E50914] font-black ml-2 hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
