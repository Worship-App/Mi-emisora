import { useState, useEffect, useRef } from 'react'
import { Mic2, Music, Play, Pause, Share2, Maximize2, Minimize2, Settings } from 'lucide-react'
import type { Song } from '../types'

interface LyricLine {
  time: number
  text: string
  translation?: string
}

interface LiveLyricsProps {
  currentSong: Song | null
  isPlaying: boolean
  currentTime: number
}

// Simulated lyrics database
const LYRICS_DB: Record<string, LyricLine[]> = {
  'default': [
    { time: 0, text: '♪ Música instrumental ♪' },
    { time: 15, text: '(Letras no disponibles para esta canción)' },
  ],
  'demo-song': [
    { time: 0, text: '(Intro)', translation: '(Intro)' },
    { time: 5, text: 'En la oscuridad de la noche', translation: 'In the darkness of the night' },
    { time: 10, text: 'Busco tu luz, mi guía', translation: 'I seek your light, my guide' },
    { time: 15, text: 'Entre mil estrellas brillantes', translation: 'Among a thousand shining stars' },
    { time: 20, text: 'Tú eres la única que sigue', translation: 'You are the only one that remains' },
    { time: 25, text: '', translation: '' },
    { time: 30, text: '(Coro)', translation: '(Chorus)' },
    { time: 35, text: 'Brilla, brilla, estrella mía', translation: 'Shine, shine, my star' },
    { time: 40, text: 'En este cielo infinito', translation: 'In this infinite sky' },
    { time: 45, text: 'Nunca dejes de brillarme', translation: 'Never stop shining for me' },
    { time: 50, text: 'Eres mi luz en el camino', translation: 'You are my light on the path' },
    { time: 55, text: '', translation: '' },
    { time: 60, text: '(Verso 2)', translation: '(Verse 2)' },
    { time: 65, text: 'Cuando las nubes cubren todo', translation: 'When clouds cover everything' },
    { time: 70, text: 'Y la lluvia cae sin parar', translation: 'And rain falls endlessly' },
    { time: 75, text: 'Sé que detrás de la tormenta', translation: 'I know that behind the storm' },
    { time: 80, text: 'Tu luz va a regresar', translation: 'Your light will return' },
    { time: 85, text: '', translation: '' },
    { time: 90, text: '(Puente)', translation: '(Bridge)' },
    { time: 95, text: 'Aunque el mundo se oscurezca', translation: 'Even if the world darkens' },
    { time: 100, text: 'Mi estrella nunca se apagará', translation: 'My star will never fade' },
    { time: 105, text: 'En mi corazón por siempre', translation: 'In my heart forever' },
    { time: 110, text: 'Tu brillo permanecerá', translation: 'Your shine will remain' },
    { time: 115, text: '', translation: '' },
    { time: 120, text: '(Coro Final)', translation: '(Final Chorus)' },
    { time: 125, text: 'Brilla, brilla, estrella mía', translation: 'Shine, shine, my star' },
    { time: 130, text: 'Por toda la eternidad', translation: 'For all eternity' },
    { time: 135, text: 'Mi luz, mi guía, mi todo', translation: 'My light, my guide, my everything' },
    { time: 140, text: 'En este cielo inmensidad', translation: 'In this sky immensity' },
    { time: 145, text: '(Outro)', translation: '(Outro)' },
    { time: 150, text: '♪', translation: '♪' },
  ]
}

export default function LiveLyrics({ currentSong, isPlaying, currentTime }: LiveLyricsProps) {
  const [showTranslation, setShowTranslation] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const lyricsRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  const lyrics = currentSong ? (LYRICS_DB[currentSong.id] || LYRICS_DB['default']) : []

  // Find current line based on playback time
  useEffect(() => {
    if (!isPlaying) return
    
    const lineIndex = lyrics.findIndex((line, index) => {
      const nextLine = lyrics[index + 1]
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time)
    })
    
    if (lineIndex !== -1 && lineIndex !== currentLine) {
      setCurrentLine(lineIndex)
    }
  }, [currentTime, lyrics, isPlaying, currentLine])

  // Scroll to current line
  useEffect(() => {
    const lineEl = lineRefs.current[currentLine]
    if (lineEl && lyricsRef.current) {
      lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentLine])

  if (!currentSong) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Mic2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Letras en Vivo</h2>
            <p className="text-white/60">Sincronizadas con la música</p>
          </div>
        </div>

        <div className="glass-premium rounded-3xl p-12 text-center">
          <Music className="w-20 h-20 mx-auto mb-6 text-white/30" />
          <p className="text-xl text-white font-semibold mb-2">No hay canción reproduciéndose</p>
          <p className="text-white/60">Reproduce una canción para ver las letras sincronizadas</p>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-8 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-8' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Mic2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Letras en Vivo</h2>
            <p className="text-white/60">Sincronizadas con la música</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-4 py-2 rounded-xl transition-all ${
              showTranslation ? 'bg-gold-500 text-black' : 'bg-white/10 text-white'
            }`}
          >
            Traducción
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Song Info */}
      <div className="glass-premium rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <img 
            src={currentSong.coverUrl} 
            alt={currentSong.title}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div>
            <h3 className="text-xl font-bold text-white">{currentSong.title}</h3>
            <p className="text-white/60">{currentSong.artist}</p>
            <div className="flex items-center gap-2 mt-2">
              {isPlaying ? (
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Reproduciendo
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-xs">
                  Pausado
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lyrics Display */}
      <div 
        ref={lyricsRef}
        className="glass-premium rounded-3xl p-8 h-[500px] overflow-y-auto scrollbar-hide"
      >
        <div className="space-y-6">
          {lyrics.map((line, index) => {
            const isCurrent = index === currentLine
            const isPast = index < currentLine

            return (
              <div
                key={index}
                ref={el => lineRefs.current[index] = el}
                className={`transition-all duration-500 ${
                  isCurrent 
                    ? 'scale-105 opacity-100' 
                    : isPast 
                      ? 'opacity-40' 
                      : 'opacity-60'
                }`}
              >
                <p className={`text-2xl md:text-3xl font-medium text-center leading-relaxed ${
                  isCurrent ? 'text-gold-400' : 'text-white'
                }`}>
                  {line.text}
                </p>
                {showTranslation && line.translation && (
                  <p className="text-lg text-white/50 text-center mt-2 italic">
                    {line.translation}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-white/50 text-sm mb-2">
          <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
          <span>{Math.floor(currentSong.duration / 60)}:{(currentSong.duration % 60).toString().padStart(2, '0')}</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gold-500 rounded-full transition-all"
            style={{ width: `${(currentTime / currentSong.duration) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20">
          <Share2 className="w-5 h-5" />
        </button>
        <button className="p-4 rounded-full bg-gold-500 text-black hover:bg-gold-400">
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <button className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}
