import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Moon, Maximize2 } from 'lucide-react'
import type { Song } from '../types'

interface AudioPlayerProps {
  currentSong: Song | null
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  onNext: () => void
  onPrevious: () => void
  queueCount?: number
  onToggleQueue?: () => void
  onAudioElementReady?: (audio: HTMLAudioElement) => void
}

export default function AudioPlayer({ 
  currentSong, 
  isPlaying, 
  setIsPlaying, 
  onNext, 
  onPrevious,
  queueCount = 0,
  onToggleQueue,
  onAudioElementReady
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [sleepTimer, setSleepTimer] = useState<number | null>(null)
  const [showSleepMenu, setShowSleepMenu] = useState(false)
  const [isTheaterMode, setIsTheaterMode] = useState(false)
  const sleepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleTheaterMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsTheaterMode(true)
      }).catch(() => {
        console.log('Fullscreen not supported')
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsTheaterMode(false)
      })
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsTheaterMode(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSong])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  useEffect(() => {
    if (audioRef.current && onAudioElementReady) {
      onAudioElementReady(audioRef.current)
    }
  }, [audioRef.current, onAudioElementReady])

  // Sleep Timer functionality
  useEffect(() => {
    if (sleepTimer && isPlaying) {
      sleepTimeoutRef.current = setTimeout(() => {
        setIsPlaying(false)
        setSleepTimer(null)
      }, sleepTimer * 60 * 1000)
    }

    return () => {
      if (sleepTimeoutRef.current) {
        clearTimeout(sleepTimeoutRef.current)
      }
    }
  }, [sleepTimer, isPlaying])

  const setSleepTimerValue = (minutes: number | null) => {
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current)
    }
    setSleepTimer(minutes)
    setShowSleepMenu(false)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleEnded = () => {
    if (isRepeating && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    } else {
      onNext()
    }
  }

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center text-gray-400">
            <p>Selecciona una canción para comenzar</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-premium-strong border-t border-gold-500/30 z-50">
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 w-1/4 min-w-[200px]">
            <img 
              src={currentSong.coverUrl} 
              alt={currentSong.title}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-gold-400/50"
            />
            <div className="hidden sm:block">
              <h3 className="font-semibold text-white truncate">{currentSong.title}</h3>
              <p className="text-sm text-gold-400 truncate">{currentSong.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`p-2 rounded-full transition-colors ${
                  isShuffled ? 'text-primary-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              
              <button 
                onClick={onPrevious}
                className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 flex items-center justify-center text-black shadow-xl glow-gold-strong hover:scale-110 transition-transform animate-pulse"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </button>
              
              <button 
                onClick={onNext}
                className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>
              
              <button
                onClick={() => setIsRepeating(!isRepeating)}
                className={`p-2 rounded-full transition-colors ${
                  isRepeating ? 'text-primary-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Repeat className="w-5 h-5" />
              </button>

              {/* Playback Speed Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
                    const currentIndex = speeds.indexOf(playbackRate)
                    const nextIndex = (currentIndex + 1) % speeds.length
                    setPlaybackRate(speeds[nextIndex])
                  }}
                  className="p-2 rounded-full text-gold-400 hover:text-gold-300 hover:bg-white/10 transition-colors text-xs font-bold min-w-[40px]"
                  title={`Velocidad: ${playbackRate}x`}
                >
                  {playbackRate}x
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md flex items-center gap-3 text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-primary-500 [&::-webkit-slider-thumb]:to-secondary-500"
                />
                <div 
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg pointer-events-none"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume & Queue */}
          <div className="flex items-center gap-3 w-1/4 justify-end">
            {/* Queue Button */}
            {onToggleQueue && (
              <button
                onClick={onToggleQueue}
                className="relative p-2 rounded-full text-gold-400 hover:text-gold-300 hover:bg-white/10 transition-colors"
                title="Ver cola de reproducción"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                  <path d="M8 6v12" />
                </svg>
                {queueCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {queueCount}
                  </span>
                )}
              </button>
            )}
            
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            {/* Theater Mode Button */}
            <button
              onClick={toggleTheaterMode}
              className={`p-2 rounded-full transition-colors ${
                isTheaterMode ? 'text-gold-400' : 'text-gray-400 hover:text-white'
              }`}
              title={isTheaterMode ? 'Salir de pantalla completa' : 'Modo pantalla completa'}
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            {/* Sleep Timer Button */}
            <div className="relative">
              <button
                onClick={() => setShowSleepMenu(!showSleepMenu)}
                className={`p-2 rounded-full transition-colors ${
                  sleepTimer ? 'text-gold-400' : 'text-gray-400 hover:text-white'
                }`}
                title={sleepTimer ? `Sleep timer: ${sleepTimer} min` : 'Sleep timer'}
              >
                <Moon className="w-5 h-5" />
                {sleepTimer && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {sleepTimer}
                  </span>
                )}
              </button>

              {showSleepMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSleepMenu(false)}
                  />
                  <div className="absolute right-0 bottom-full mb-2 w-48 glass-premium-strong rounded-2xl p-3 z-50 border border-gold-500/20 shadow-2xl">
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-3 px-2">
                      Sleep Timer
                    </p>
                    {[5, 10, 15, 30, 45, 60].map((minutes) => (
                      <button
                        key={minutes}
                        onClick={() => setSleepTimerValue(minutes)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl transition-colors ${
                          sleepTimer === minutes
                            ? 'bg-gold-500/20 text-gold-400'
                            : 'text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <span>{minutes} minutos</span>
                        {sleepTimer === minutes && (
                          <span className="w-2 h-2 bg-gold-400 rounded-full" />
                        )}
                      </button>
                    ))}
                    <div className="h-px bg-white/10 my-2" />
                    <button
                      onClick={() => setSleepTimerValue(null)}
                      className="w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      Desactivar
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="w-24 hidden sm:block">
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-primary-500 [&::-webkit-slider-thumb]:to-secondary-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
