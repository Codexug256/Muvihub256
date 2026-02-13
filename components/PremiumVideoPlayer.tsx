
import React, { useRef, useState, useEffect } from 'react';

interface Props {
  url: string;
  title: string;
  poster: string;
  onClose: () => void;
  onDownload: () => void;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const PremiumVideoPlayer: React.FC<Props> = ({ url, title, poster, onClose, onDownload }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
  const controlsTimeout = useRef<any>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const togglePlay = async () => {
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused) {
        playPromiseRef.current = videoRef.current.play();
        await playPromiseRef.current;
        setIsPlaying(true);
      } else {
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error("Playback interrupted:", error);
      }
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleSkipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 90; // Typical intro duration
      setShowControls(true);
      resetControlsTimeout();
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p || 0);
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;
      videoRef.current.currentTime = pct * videoRef.current.duration;
    }
  };

  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying && !isBuffering && !showSpeedMenu) setShowControls(false);
    }, 4000);
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => clearTimeout(controlsTimeout.current);
  }, [isPlaying, isBuffering, showSpeedMenu]);

  useEffect(() => {
    const initiatePlay = async () => {
      if (videoRef.current) {
        try {
          setIsBuffering(true);
          videoRef.current.crossOrigin = "anonymous";
          playPromiseRef.current = videoRef.current.play();
          await playPromiseRef.current;
          setIsPlaying(true);
        } catch (e) {
          console.debug("Auto-play failed, waiting for user interaction.");
          setIsPlaying(false);
        }
      }
    };
    initiatePlay();

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
        videoRef.current.load();
      }
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden cursor-none"
      onMouseMove={() => { setShowControls(true); resetControlsTimeout(); }}
      onClick={() => { setShowControls(true); resetControlsTimeout(); setShowSpeedMenu(false); }}
      style={{ cursor: showControls ? 'default' : 'none' }}
    >
      {/* Background landscape visible during initial buffering */}
      <div className={`absolute inset-0 transition-opacity duration-1000 z-0 ${isBuffering || currentTime < 1 ? 'opacity-100' : 'opacity-0'}`}>
        <img src={poster} className="w-full h-full object-cover" alt="Backdrop" />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <video 
        ref={videoRef}
        src={url}
        poster={poster}
        className="w-full h-full object-contain relative z-10"
        onTimeUpdate={handleTimeUpdate}
        onLoadStart={() => setIsBuffering(true)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
        onLoadedData={() => setIsBuffering(false)}
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        playsInline
      />

      {isBuffering && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[50] pointer-events-none transition-opacity duration-300">
          <div className="relative w-20 h-20">
             <div className="absolute inset-[-10px] bg-[#9f1239]/20 rounded-full blur-xl animate-pulse"></div>
             <div className="absolute inset-0 border-[4px] border-white/5 rounded-full"></div>
             <div className="absolute inset-0 border-[4px] border-transparent border-t-[#9f1239] rounded-full animate-spin"></div>
          </div>
          <div className="mt-8">
            <p className="text-white font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Loading...</p>
          </div>
        </div>
      )}

      <div className={`absolute inset-0 z-20 bg-gradient-to-t from-black/95 via-transparent to-black/80 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start">
          <div className="flex items-center gap-5">
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white hover:bg-[#9f1239] transition-all">
              <i className="fas fa-chevron-left text-sm"></i>
            </button>
            <div>
              {/* Title set to smallest possible readable size */}
              <h2 className="text-[8px] font-black truncate drop-shadow-lg leading-tight uppercase tracking-widest">{title}</h2>
              <p className="text-[#9f1239] text-[6px] font-black tracking-[0.4em] uppercase mt-0.5">MuviHub Pro Max Stream</p>
            </div>
          </div>
          <button onClick={onDownload} className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all">
            <i className="fas fa-download text-xs"></i>
          </button>
        </div>

        {/* Center Controls */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-12 transition-all duration-300 ${isBuffering ? 'opacity-0' : 'opacity-100'}`}>
           <button onClick={(e) => { e.stopPropagation(); skip(-10); }} className="text-white/40 hover:text-white transition-all text-2xl">
             <i className="fas fa-undo-alt"></i>
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); togglePlay(); }}
             className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white text-3xl shadow-2xl hover:scale-110 active:scale-90 transition-all border border-white/10"
           >
             <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play ml-1.5'}`}></i>
           </button>
           <button onClick={(e) => { e.stopPropagation(); skip(10); }} className="text-white/40 hover:text-white transition-all text-2xl">
             <i className="fas fa-redo-alt"></i>
           </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="relative mb-6">
            <div className="h-1 w-full bg-white/10 rounded-full cursor-pointer overflow-hidden relative" onClick={handleSeek}>
              <div className="absolute top-0 left-0 h-full bg-[#9f1239] transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 text-white font-black text-[9px] tracking-widest tabular-nums">
                <span>{formatTime(currentTime)}</span>
                <span className="text-white/20">/</span>
                <span className="text-white/40">{formatTime(duration)}</span>
              </div>
              
              <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="text-white/40 hover:text-white text-sm transition-all">
                 <i className={`fas ${isMuted || volume === 0 ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
              </button>
            </div>

            <div className="flex items-center gap-6">
               <div className="relative">
                 <button onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); }} className="text-[8px] font-black uppercase bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-white/60 hover:text-white transition-all">
                   {playbackSpeed}x
                 </button>
                 {showSpeedMenu && (
                   <div className="absolute bottom-full right-0 mb-3 bg-black/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                      {speeds.map(s => (
                        <button key={s} onClick={(e) => { e.stopPropagation(); handleSpeedChange(s); }} className={`w-full px-5 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-[#9f1239] ${playbackSpeed === s ? 'text-[#9f1239]' : 'text-white/50'}`}>{s}x</button>
                      ))}
                   </div>
                 )}
               </div>
               <button onClick={(e) => { e.stopPropagation(); videoRef.current?.requestFullscreen(); }} className="text-white/40 hover:text-white transition-all">
                 <i className="fas fa-expand text-sm"></i>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumVideoPlayer;
