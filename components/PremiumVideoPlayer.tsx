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
          console.debug("Auto-play blocked or failed, waiting for user interaction.");
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
      <video 
        ref={videoRef}
        src={url}
        poster={poster}
        className="w-full h-full object-contain"
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[4px] z-[50] pointer-events-none transition-opacity duration-300">
          <div className="relative w-24 h-24">
             <div className="absolute inset-[-10px] bg-[#E50914]/10 rounded-full blur-xl animate-pulse"></div>
             <div className="absolute inset-0 border-[6px] border-white/5 rounded-full"></div>
             <div className="absolute inset-0 border-[6px] border-transparent border-t-[#E50914] rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <img src="https://iili.io/f6WKiPV.png" className="w-8 h-8 opacity-40" alt="Logo" />
             </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-white font-black uppercase tracking-[0.5em] text-[12px] animate-pulse drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]">Loading...</p>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">MuviHub Premium Quality</p>
          </div>
        </div>
      )}

      <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/80 transition-opacity duration-500 ease-out ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start">
          <div className="flex items-center gap-5">
            <button onClick={onClose} className="w-14 h-14 flex items-center justify-center bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl text-white hover:bg-[#E50914] transition-all group">
              <i className="fas fa-chevron-left group-hover:-translate-x-1 transition-transform"></i>
            </button>
            <div className="max-w-md sm:max-w-xl">
              <h2 className="text-2xl font-black truncate drop-shadow-lg leading-tight uppercase tracking-tighter">{title}</h2>
              <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase mt-1">MuviHub Premium Stream • 1080p</p>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={onDownload} className="w-14 h-14 flex items-center justify-center bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl text-white hover:bg-white/20 transition-all">
               <i className="fas fa-download"></i>
             </button>
          </div>
        </div>

        {/* Skip Intro Button */}
        {currentTime < 90 && (
          <div className={`absolute bottom-32 right-8 transition-all duration-500 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); handleSkipIntro(); }}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] hover:bg-[#E50914] hover:border-[#E50914] transition-all shadow-2xl active:scale-95"
            >
              Skip Intro <i className="fas fa-forward"></i>
            </button>
          </div>
        )}

        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-12 sm:gap-24 transition-all duration-300 ${isBuffering ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
           <button onClick={(e) => { e.stopPropagation(); skip(-10); }} className="text-white/60 hover:text-white transition-all text-2xl sm:text-4xl hover:scale-110 active:scale-90">
             <i className="fas fa-undo-alt"></i>
             <span className="block text-[10px] font-black mt-2 text-center uppercase">10s</span>
           </button>

           <button 
             onClick={(e) => { e.stopPropagation(); togglePlay(); }}
             className="w-24 h-24 sm:w-32 sm:h-32 bg-[#E50914] rounded-full flex items-center justify-center text-white text-3xl sm:text-5xl shadow-[0_0_80px_rgba(229,9,20,0.6)] hover:scale-110 active:scale-90 transition-all border-4 border-white/10"
           >
             <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play ml-3'}`}></i>
           </button>

           <button onClick={(e) => { e.stopPropagation(); skip(10); }} className="text-white/60 hover:text-white transition-all text-2xl sm:text-4xl hover:scale-110 active:scale-90">
             <i className="fas fa-redo-alt"></i>
             <span className="block text-[10px] font-black mt-2 text-center uppercase">10s</span>
           </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 pt-0">
          
          <div className="relative mb-6 group">
            <div 
              className="h-1.5 w-full bg-white/20 rounded-full cursor-pointer transition-all group-hover:h-3 overflow-hidden relative"
              onClick={handleSeek}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-[#E50914] shadow-[0_0_20px_rgba(229,9,20,1)] rounded-full transition-all" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-[#E50914] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 8px)` }}
            ></div>
          </div>

          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 text-white font-black text-xs tracking-widest tabular-nums">
                <span className="text-white drop-shadow-lg">{formatTime(currentTime)}</span>
                <span className="text-white/30">/</span>
                <span className="text-white/40">{formatTime(duration)}</span>
              </div>
              
              <div className="flex items-center gap-4 group/vol">
                <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="text-white/60 hover:text-white text-lg transition-all">
                   <i className={`fas ${isMuted || volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up'}`}></i>
                </button>
                <div className="w-0 group-hover/vol:w-24 transition-all duration-300 overflow-hidden flex items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={isMuted ? 0 : volume}
                    onChange={(e) => { 
                      const val = parseFloat(e.target.value);
                      setVolume(val); 
                      setIsMuted(false); 
                      if(videoRef.current) videoRef.current.volume = val; 
                    }}
                    className="w-full h-1 appearance-none bg-white/20 rounded-full overflow-hidden [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 [&::-webkit-slider-thumb]:shadow-[-100px_0_0_100px_rgba(229,9,20,0.8)] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 relative">
               <div className="relative">
                 <button 
                  onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); }}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all text-white/80"
                 >
                    {playbackSpeed}x
                 </button>
                 
                 {showSpeedMenu && (
                   <div className="absolute bottom-full right-0 mb-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-w-[100px] animate-slide-up">
                      <div className="p-3 border-b border-white/5 text-[8px] font-black text-white/30 uppercase tracking-[0.2em] text-center">Speed</div>
                      {speeds.map(s => (
                        <button
                          key={s}
                          onClick={(e) => { e.stopPropagation(); handleSpeedChange(s); }}
                          className={`w-full px-5 py-3 text-[10px] font-black uppercase tracking-widest text-center transition-all ${playbackSpeed === s ? 'bg-[#E50914] text-white' : 'text-white/60 hover:bg-white/5'}`}
                        >
                          {s}x
                        </button>
                      ))}
                   </div>
                 )}
               </div>

               <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all text-white/80">
                  <i className="fas fa-cog text-white/40"></i> 1080P
               </button>
               
               <button onClick={(e) => { e.stopPropagation(); videoRef.current?.requestFullscreen(); }} className="text-white/60 hover:text-white transition-all text-xl">
                 <i className="fas fa-expand"></i>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumVideoPlayer;