import React, { useEffect } from 'react';

interface Props {
  message: string;
  type: 'success' | 'error';
  onHide: () => void;
}

const ToastNotification: React.FC<Props> = ({ message, type, onHide }) => {
  useEffect(() => {
    const t = setTimeout(onHide, 4000);
    return () => clearTimeout(t);
  }, [onHide]);

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[99999] px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/10 shadow-2xl backdrop-blur-xl animate-bounce-in min-w-[280px] ${type === 'success' ? 'bg-[#9f1239]/90' : 'bg-red-500/90'}`}>
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} text-xl`}></i>
      <span className="font-bold">{message}</span>
    </div>
  );
};

export default ToastNotification;