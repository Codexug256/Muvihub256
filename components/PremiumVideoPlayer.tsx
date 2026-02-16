
import React, { useRef, useState, useEffect, useCallback } from 'react';

interface Props {
  url: string;
  title: string;
  poster: string;
  onClose: () => void;
  onDownload: () => void;
  downloadProgress?: number;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
};

const PremiumVideoPlayer: React.FC<Props> = ({ url, title, poster, onClose, onDownload, downloadProgress }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [showSkipFeedback, setShowSkipFeedback] = useState<'forward' | 'backward' | null>(null);
  
  const controlsTimeout = useRef<any>(null);
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    setIsPiPSupported(document.pictureInPictureEnabled);
  }, []);

  const hideControls = useCallback(() => {
    if (isPlaying && !isBuffering && !showSpeedMenu) {
      setShowControls(false);
    }
  }, [isPlaying, isBuffering, showSpeedMenu]);

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    // Controls disappear immediately after 3 seconds of inactivity as requested
    controlsTimeout.current = setTimeout(hideControls, 3000);
  }, [hideControls]);

  const togglePlay = async (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback failed:", err);
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimeout();
  };

  const skip = (seconds: number, e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      setShowSkipFeedback(seconds > 0 ? 'forward' : 'backward');
      setTimeout(() => setShowSkipFeedback(null), 600);
    }
    resetControlsTimeout();
  };

  const handleSpeedChange = (speed: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  const togglePiP = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error("PiP failed:", err);
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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !duration) return;
    
    let clientX: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    videoRef.current.currentTime = pct * duration;
    resetControlsTimeout();
  };

  const skipIntro = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime += 85; // Skip 85 seconds
      resetControlsTimeout();
    }
  };

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => setIsPlaying(false));
    }
    return () => {
      if (v) {
        v.pause();
        v.src = "";
        v.load();
      }
    };
  }, []);

  const isDownloading = downloadProgress !== undefined;
  const isIntroPeriod = currentTime > 10 && currentTime < 90;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden touch-none select-none"
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
      onContextMenu={(e) => e.preventDefault()}
    >
      <style>{`
        .video-player-gradient-top {
          background: linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 70%, transparent 100%);
        }
        .video-player-gradient-bottom {
          background: linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.6) 60%, transparent 100%);
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
        }
        .animate-feedback {
          animation: fadeInOut 0.6s ease-out forwards;
        }
        .skip-btn-blur {
          backdrop-filter: blur(20px) saturate(180%);
        }
      `}</style>

      {/* Poster Background / Underlay */}
      <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${currentTime < 1 ? 'opacity-100' : 'opacity-0'}`}>
        <img src={poster} className="w-full h-full object-cover blur-3xl opacity-20 scale-110" alt="" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <video 
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain pointer-events-none"
        onTimeUpdate={handleTimeUpdate}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        playsInline
        webkit-playsinline="true"
        muted={isMuted}
        disablePictureInPicture={false}
      />

      {/* Main Touch Overlay */}
      <div 
        className="absolute inset-0 z-10" 
        onClick={(e) => {
          // If controls are hidden, show them. If they are visible, toggle playback.
          if (!showControls) {
            resetControlsTimeout();
          } else {
            togglePlay(e);
          }
        }}
        onDoubleClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x < rect.width / 2) skip(-10);
          else skip(10);
        }}
      ></div>

      {/* Loading State */}
      {isBuffering && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none bg-black/20 backdrop-blur-[2px]">
          <div className="w-14 h-14 border-4 border-white/5 border-t-[#9f1239] rounded-full animate-spin"></div>
          <p className="mt-4 text-[9px] font-black uppercase tracking-[0.5em] text-white/40">Optimizing Stream</p>
        </div>
      )}

      {/* Visual Feedback for Double Tap */}
      {showSkipFeedback && (
        <div className={`absolute top-1/2 ${showSkipFeedback === 'forward' ? 'right-[20%]' : 'left-[20%]'} z-30 pointer-events-none`}>
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center animate-feedback backdrop-blur-md">
            <i className={`fas fa-${showSkipFeedback === 'forward' ? 'redo' : 'undo'} text-2xl text-[#9f1239]`}></i>
            <span className="text-[10px] font-black mt-2">10s</span>
          </div>
        </div>
      )}

      {/* Control UI Layout */}
      <div className={`absolute inset-0 z-40 transition-all duration-500 ease-in-out ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Top Navigation & Info */}
        <div className="absolute top-0 left-0 w-full p-6 pt-10 video-player-gradient-top flex justify-between items-start">
          <div className="flex items-center gap-5">
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              className="w-12 h-12 bg-white/5 skip-btn-blur border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-[#9f1239] transition-all"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-white uppercase tracking-tight truncate max-w-[200px] sm:max-w-md drop-shadow-2xl">
                {title}
              </h2>
              <div className="flex items-center gap-3 mt-1 opacity-60">
                <span className="text-[8px] font-black text-[#9f1239] uppercase tracking-widest bg-[#9f1239]/10 px-2 py-0.5 rounded border border-[#9f1239]/20">Premium 4K</span>
                <span className="text-[8px] font-black text-white uppercase tracking-widest">VJ Luganda Commentary</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
             <button 
              onClick={togglePiP}
              className={`w-12 h-12 rounded-2xl bg-white/5 skip-btn-blur border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all ${!isPiPSupported && 'hidden'}`}
            >
              <i className="fas fa-clone text-sm"></i>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); !isDownloading && onDownload(); }}
              className={`w-12 h-12 rounded-2xl border border-white/10 skip-btn-blur flex items-center justify-center transition-all ${isDownloading ? 'bg-[#9f1239]/20' : 'bg-white/5 text-white/70 hover:text-white'}`}
            >
              {isDownloading ? (
                <span className="text-[9px] font-black text-[#9f1239]">{downloadProgress}%</span>
              ) : (
                <i className="fas fa-download text-sm"></i>
              )}
            </button>
          </div>
        </div>

        {/* Central Controls - Transparent play/pause as requested */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-14 sm:gap-24">
          <button onClick={(e) => skip(-10, e)} className="w-16 h-16 flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-90">
            <i className="fas fa-rotate-left text-3xl"></i>
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-24 h-24 text-white flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play ml-2'} text-7xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]`}></i>
          </button>

          <button onClick={(e) => skip(10, e)} className="w-16 h-16 flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-90">
            <i className="fas fa-rotate-right text-3xl"></i>
          </button>
        </div>

        {/* Skip Intro Button */}
        {isIntroPeriod && (
          <button 
            onClick={skipIntro}
            className="absolute right-8 bottom-36 px-6 py-3 bg-white/10 skip-btn-blur border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#9f1239] hover:border-[#9f1239] transition-all animate-bounce-in shadow-2xl"
          >
            Skip Intro
          </button>
        )}

        {/* Bottom Bar Area */}
        <div className="absolute bottom-0 left-0 w-full p-6 pb-12 video-player-gradient-bottom">
          
          {/* Seek Bar with Dynamic Glow */}
          <div className="relative group px-2 mb-8">
            <div 
              className="relative h-1.5 w-full bg-white/10 rounded-full cursor-pointer touch-none" 
              onClick={handleSeek}
              onTouchMove={handleSeek}
            >
              {/* Buffer Level */}
              <div className="absolute top-0 left-0 h-full bg-white/5 rounded-full" style={{ width: '95%' }}></div>
              
              {/* Progress Line */}
              <div 
                className="absolute top-0 left-0 h-full bg-[#9f1239] rounded-full shadow-[0_0_15px_rgba(159,18,57,0.8)]" 
                style={{ width: `${progress}%` }}
              ></div>

              {/* Seek Handle */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 border-2 border-[#9f1239]" 
                style={{ left: `${progress}%`, marginLeft: '-8px' }}
              ></div>
            </div>
            
            {/* Hover Time Indicator */}
            <div className="absolute -top-10 left-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}>
               <span className="bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono border border-white/10 text-white">
                 {formatTime(currentTime)}
               </span>
            </div>
          </div>

          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <span className="text-[13px] font-black text-white font-mono tracking-tighter">{formatTime(currentTime)}</span>
                 <span className="text-[10px] text-white/20 font-black">/</span>
                 <span className="text-[13px] font-black text-white/40 font-mono tracking-tighter">{formatTime(duration)}</span>
              </div>

              {/* Volume Slider */}
              <div className="hidden sm:flex items-center gap-3 group/vol">
                <button onClick={() => setIsMuted(!isMuted)} className="text-white/40 hover:text-white transition-colors">
                  <i className={`fas ${isMuted || volume === 0 ? 'fa-volume-mute text-[#9f1239]' : 'fa-volume-up'} text-sm`}></i>
                </button>
                <div className="w-0 group-hover/vol:w-20 transition-all duration-300 overflow-hidden">
                  <input 
                    type="range" 
                    min="0" max="1" step="0.1" 
                    value={volume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolume(v);
                      if (videoRef.current) videoRef.current.volume = v;
                    }}
                    className="accent-[#9f1239] w-full cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
              {/* Playback Speed Menu */}
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/70 hover:text-white hover:bg-[#9f1239] transition-all"
                >
                  <i className="fas fa-gauge-high mr-2 opacity-40"></i>
                  {playbackSpeed}x
                </button>
                
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-4 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-slide-up w-28 z-[100]">
                    <div className="p-3 border-b border-white/5 text-center">
                      <p className="text-[7px] font-black uppercase tracking-widest text-white/30">Playback Speed</p>
                    </div>
                    {speeds.map(s => (
                      <button 
                        key={s} 
                        onClick={(e) => handleSpeedChange(s, e)}
                        className={`w-full py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${playbackSpeed === s ? 'bg-[#9f1239] text-white' : 'text-white/40 hover:bg-white/5'}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all"
                onClick={(e) => { e.stopPropagation(); containerRef.current?.requestFullscreen(); }}
              >
                <i className="fas fa-expand-alt text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumVideoPlayer;
