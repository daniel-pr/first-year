import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Disc, ChevronUp, ChevronDown, AlertCircle, RotateCcw, Loader2, Sparkles, Info } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';
import { resolveAudioUrl } from '../config/anniversaryConfig';

export const MusicPlayer: React.FC = () => {
  const { config } = useAnniversary();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showErrorHelp, setShowErrorHelp] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { music } = config;
  // Resolve asset URL dynamically considering Vite's base path for GitHub Pages
  const resolvedSrc = resolveAudioUrl(music.filePath || '/musica/nossa-musica.mp3');

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Synchronize volume and mute with native audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Handle src changes without auto-playing
  useEffect(() => {
    setHasError(false);
    setIsLoading(false);
    setCurrentTime(0);
    setDuration(0);
  }, [resolvedSrc]);

  const handleTogglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        setIsLoading(true);
        setHasError(false);
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (err) {
        console.warn('Playback error or file not found:', err);
        setIsPlaying(false);
        setIsLoading(false);
        setHasError(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = val;
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        handleTogglePlay();
      }
    }
  };

  // Audio element event listeners
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setIsLoading(false);
      setHasError(false);
    }
  };

  const onWaiting = () => {
    setIsLoading(true);
  };

  const onCanPlay = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const onEnded = () => {
    if (music.loop && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(false);
    }
  };

  const onError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    setHasError(true);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-2rem)] sm:max-w-sm select-none transition-all duration-300">
      {/* Native HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={resolvedSrc}
        preload="metadata"
        loop={music.loop}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onWaiting={onWaiting}
        onCanPlay={onCanPlay}
        onEnded={onEnded}
        onError={onError}
      />

      {isMinimized ? (
        /* Minimized Medallion View */
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-[#4a0e17] text-white rounded-full shadow-xl border border-[#d4af37]/60 hover:bg-[#6a1b29] transition-all hover:scale-105 cursor-pointer group"
          aria-label="Expandir tocador de música"
        >
          <Disc className={`w-5 h-5 text-[#ffdada] ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="text-xs font-serif tracking-tight pr-1 font-medium">
            {music.title || 'Nossa Música'}
          </span>
          <ChevronUp className="w-4 h-4 text-[#d4af37] transition-transform group-hover:-translate-y-0.5" />
        </button>
      ) : (
        /* Expanded Glassmorphic Music Player */
        <div className="glass-panel rounded-xl p-3.5 sm:p-4 shadow-xl border border-[#d4af37]/40 relative group bg-[#fffdfa]/95 backdrop-blur-md">
          {/* Header Row: Track title & minimize button */}
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-full bg-[#4a0e17] text-white flex items-center justify-center shrink-0 border border-[#d4af37]/40 shadow-xs ${
                  isPlaying ? 'animate-gentle-pulse' : ''
                }`}
              >
                <Music className="w-4 h-4 text-[#ffdada]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-serif font-semibold text-[#2a0006] truncate">
                  {music.title || 'Nossa Canção Especial'}
                </div>
                <div className="text-[11px] text-[#867273] truncate">
                  {music.artist || 'Música do Casal'}
                </div>
              </div>
            </div>

            {/* Minimize button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-[#867273] hover:text-[#4a0e17] transition-colors rounded-sm cursor-pointer shrink-0"
              aria-label="Minimizar tocador"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Progress Bar & Time Readout */}
          <div className="mb-2">
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max={duration > 0 ? duration : 100}
                step="0.1"
                value={duration > 0 ? currentTime : 0}
                onChange={handleSeek}
                disabled={duration <= 0 || hasError}
                aria-label="Progresso da música"
                className="w-full h-1.5 bg-[#eae8e4] rounded-lg appearance-none cursor-pointer accent-[#4a0e17] focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: duration > 0
                    ? `linear-gradient(to right, #4a0e17 ${progressPercent}%, #eae8e4 ${progressPercent}%)`
                    : '#eae8e4',
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#867273] mt-1 tabular-nums font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : (hasError ? '--:--' : '00:00')}</span>
            </div>
          </div>

          {/* Controls Row: Play/Pause, Restart, Volume, Mute */}
          <div className="flex items-center justify-between gap-3 pt-0.5">
            {/* Play / Pause & Restart */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleTogglePlay}
                disabled={isLoading}
                className="p-2.5 rounded-full bg-[#4a0e17] hover:bg-[#6a1b29] text-white shadow-sm border border-[#d4af37]/40 transition-transform active:scale-95 cursor-pointer disabled:opacity-70"
                aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#ffdada]" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                )}
              </button>

              <button
                onClick={handleRestart}
                className="p-1.5 text-[#544343] hover:text-[#4a0e17] transition-colors rounded-full hover:bg-[#eae8e4]/60 cursor-pointer"
                title="Reiniciar música do início"
                aria-label="Reiniciar música"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleMute}
                className="p-1.5 text-[#544343] hover:text-[#4a0e17] transition-colors rounded-full cursor-pointer"
                aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-[#867273]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#544343]" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                aria-label="Controle de volume"
                className="w-16 h-1.5 bg-[#eae8e4] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
            </div>
          </div>

          {/* Graceful & Friendly Fallback Notification if MP3 file is not yet placed */}
          {hasError && (
            <div className="mt-2.5 pt-2 border-t border-[#d9c1c1]/50 text-left">
              <div className="flex items-start gap-1.5 text-[11px] text-[#735c00] bg-[#fbf7f0] p-2 rounded-md border border-[#d4af37]/30">
                <AlertCircle className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-[#4a0e17]">
                    Arquivo MP3 não encontrado
                  </p>
                  <p className="text-[10px] text-[#544343] mt-0.5">
                    Adicione seu arquivo em <code className="bg-white px-1 py-0.5 rounded border border-[#d9c1c1] font-mono text-[9px] text-[#4a0e17]">public/musica/nossa-musica.mp3</code>
                  </p>
                  <button
                    onClick={() => setShowErrorHelp(prev => !prev)}
                    className="text-[10px] text-[#4a0e17] underline font-medium mt-1 cursor-pointer hover:text-[#6a1b29] flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    <span>{showErrorHelp ? 'Ocultar instruções' : 'Ver como adicionar'}</span>
                  </button>
                </div>
              </div>

              {showErrorHelp && (
                <div className="mt-1.5 p-2 bg-white rounded text-[10px] text-[#544343] border border-[#d9c1c1] space-y-1 animate-in fade-in">
                  <p>1. Copie o arquivo MP3 da música do casal.</p>
                  <p>2. Salve na pasta <strong className="text-[#4a0e17]">public/musica/</strong> com o nome <strong className="text-[#4a0e17]">nossa-musica.mp3</strong>.</p>
                  <p>3. Ao recarregar a página, a música tocará perfeitamente inclusive no GitHub Pages!</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
