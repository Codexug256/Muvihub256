
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
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSkipFeedback, setShowSkipFeedback] = useState<'forward' | 'backward' | null>(null);
  
  const controlsTimeout = useRef<any>(null);
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const hideControls = useCallback(() => {
    if (isPlaying && !isBuffering && !showSpeedMenu) {
      setShowControls(false);
    }
  }, [isPlaying, isBuffering, showSpeedMenu]);

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(hideControls, 3500);
  }, [hideControls]);

  const togglePlay = async (e?: React.MouseEvent) => {
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

  const skip = (seconds: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      setShowSkipFeedback(seconds > 0 ? 'forward' : 'backward');
      setTimeout(() => setShowSkipFeedback(null), 500);
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p || 0);
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      videoRef.current.currentTime = pct * videoRef.current.duration;
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
      }
    };
  }, []);

  const isDownloading = downloadProgress !== undefined;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden touch-none"
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
      onContextMenu={(e) => e.preventDefault()}
    >
      <style>{`
        .video-player-gradient-top {
          background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);
        }
        .video-player-gradient-bottom {
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
        }
        .seek-bar-glow {
          box-shadow: 0 0 10px rgba(159, 18, 57, 0.5);
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .skip-ripple {
          animation: ripple 0.5s ease-out forwards;
        }
      `}</style>

      {/* Poster Background for loading state */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${currentTime < 0.5 ? 'opacity-100' : 'opacity-0'}`}>
        <img src={poster} className="w-full h-full object-cover blur-sm" alt="" />
        <div className="absolute inset-0 bg-black/40"></div>
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
        muted={isMuted}
      />

      {/* Interactive Overlay */}
      <div 
        className="absolute inset-0 z-10" 
        onClick={togglePlay}
        onDoubleClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x < rect.width / 2) skip(-10);
          else skip(10);
        }}
      ></div>

      {/* Loading/Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none animate-fade-in">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#9f1239] rounded-full animate-spin"></div>
          </div>
          <span className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Buffering...</span>
        </div>
      )}

      {/* Skip Feedback Icons */}
      {showSkipFeedback && (
        <div className={`absolute top-1/2 ${showSkipFeedback === 'forward' ? 'right-[20%]' : 'left-[20%]'} -translate-y-1/2 z-30 pointer-events-none`}>
          <div className="w-20 h-20 rounded-full bg-white/10 flex flex-col items-center justify-center skip-ripple">
            <i className={`fas fa-${showSkipFeedback === 'forward' ? 'forward' : 'backward'} text-2xl text-white`}></i>
            <span className="text-[10px] font-black mt-1">10s</span>
          </div>
        </div>
      )}

      {/* Modern Controls Overlay */}
      <div className={`absolute inset-0 z-40 transition-opacity duration-500 ${showControls ? 'opacity-100 cursor-default' : 'opacity-0 pointer-events-none cursor-none'}`}>
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 w-full p-6 pt-10 video-player-gradient-top flex justify-between items-start">
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/10 hover:bg-[#9f1239] transition-all"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="max-w-[200px] sm:max-w-md">
              <h2 className="text-sm font-black text-white uppercase tracking-tight truncate drop-shadow-lg">{title}</h2>
              <p className="text-[#9f1239] text-[7px] font-black tracking-[0.3em] uppercase mt-0.5">MuviHub Premium Stream</p>
            </div>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); !isDownloading && onDownload(); }}
            className={`w-12 h-12 rounded-2xl border border-white/10 backdrop-blur-md flex items-center justify-center transition-all ${isDownloading ? 'bg-[#9f1239]/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {isDownloading ? (
              <span className="text-[8px] font-black text-[#9f1239]">{downloadProgress}%</span>
            ) : (
              <i className="fas fa-download text-sm"></i>
            )}
          </button>
        </div>

        {/* Center Play Button (Catchy) */}
        {!isBuffering && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button 
              onClick={togglePlay}
              className="w-20 h-20 bg-[#9f1239] text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(159,18,57,0.6)] hover:scale-110 active:scale-95 transition-all group"
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play ml-1'} text-2xl group-hover:scale-110 transition-transform`}></i>
            </button>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 w-full p-6 pb-10 video-player-gradient-bottom">
          {/* Refined Seek Bar */}
          <div className="mb-6 px-2">
            <div 
              className="group relative h-1.5 w-full bg-white/10 rounded-full cursor-pointer overflow-hidden" 
              onClick={handleSeek}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-[#9f1239] rounded-full transition-all duration-100 seek-bar-glow" 
                style={{ width: `${progress}%` }}
              ></div>
              <div 
                className="absolute top-0 h-full w-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity" 
                style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 font-mono text-[11px] font-bold tracking-tight">
                <span className="text-white">{formatTime(currentTime)}</span>
                <span className="text-white/20">/</span>
                <span className="text-white/40">{formatTime(duration)}</span>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} 
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <i className={`fas ${isMuted ? 'fa-volume-mute text-[#9f1239]' : 'fa-volume-up'} text-sm`}></i>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); }}
                  className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/70 hover:text-white hover:bg-[#9f1239] transition-all"
                >
                  {playbackSpeed}x
                </button>
                
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-4 bg-[#141414] border border-white/10 rounded-[1.5rem] overflow-hidden shadow-2xl animate-slide-up w-24">
                    {speeds.map(s => (
                      <button 
                        key={s} 
                        onClick={(e) => handleSpeedChange(s, e)}
                        className={`w-full py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${playbackSpeed === s ? 'bg-[#9f1239] text-white' : 'text-white/40 hover:bg-white/5'}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); videoRef.current?.requestFullscreen(); }}
                className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"
              >
                <i className="fas fa-expand text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumVideoPlayer;
