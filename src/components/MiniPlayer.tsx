import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import type { Song } from '../types'

interface MiniPlayerProps {
  currentSong: Song | null
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  onNext: () => void
  onPrevious: () => void
  isVisible: boolean
  onClick: () => void
}

export default function MiniPlayer({ 
  currentSong, 
  isPlaying, 
  setIsPlaying, 
  onNext, 
  onPrevious,
  isVisible,
  onClick
}: MiniPlayerProps) {
  if (!currentSong || !isVisible) return null

  return (
    <div 
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-[90%] max-w-lg animate-in slide-in-from-top-5 fade-in duration-300"
      onClick={onClick}
    >
      <div className="glass-premium-strong rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-gold-500/40 transition-colors border border-gold-500/20 shadow-2xl">
        {/* Cover */}
        <img 
          src={currentSong.coverUrl} 
          alt={currentSong.title}
          className="w-12 h-12 rounded-lg object-cover ring-2 ring-gold-400/30"
        />
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm truncate">
            {currentSong.title}
          </h4>
          <p className="text-xs text-gold-400/80 truncate">
            {currentSong.artist}
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrevious()
            }}
            className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsPlaying(!isPlaying)
            }}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 flex items-center justify-center text-black shadow-lg hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>
        
        {/* Playing indicator */}
        <div className="flex items-end gap-0.5 h-4 ml-2">
          <span className={`w-1 bg-gold-400 rounded-full ${isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-1'}`} style={{ animationDelay: '0ms' }} />
          <span className={`w-1 bg-gold-400 rounded-full ${isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-1'}`} style={{ animationDelay: '150ms' }} />
          <span className={`w-1 bg-gold-400 rounded-full ${isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-1'}`} style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
