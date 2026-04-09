import { useState, useEffect } from 'react'
import { Smile, Zap, Coffee, Moon, Sun, CloudRain, Music, Wind, Activity, Brain } from 'lucide-react'
import type { Song } from '../types'

interface MoodDetectorProps {
  songs: Song[]
  currentMood: string
  onMoodChange: (mood: string) => void
  onPlay: (song: Song) => void
  onAddToQueue: (song: Song) => void
}

type Mood = {
  id: string
  name: string
  icon: React.ElementType
  color: string
  genres: string[]
  description: string
}

const MOODS: Mood[] = [
  {
    id: 'happy',
    name: 'Feliz',
    icon: Smile,
    color: 'from-yellow-400 to-orange-500',
    genres: ['Pop', 'Dance', 'Reggaeton', 'Salsa'],
    description: 'Música alegre para elevar tu ánimo'
  },
  {
    id: 'energetic',
    name: 'Energético',
    icon: Zap,
    color: 'from-red-500 to-pink-500',
    genres: ['Rock', 'Electronic', 'Hip Hop', 'Metal'],
    description: 'Alto ritmo para entrenar o trabajar'
  },
  {
    id: 'relaxed',
    name: 'Relajado',
    icon: Coffee,
    color: 'from-teal-400 to-green-500',
    genres: ['Chill', 'Ambient', 'Jazz', 'Classical'],
    description: 'Música tranquila para desconectar'
  },
  {
    id: 'focused',
    name: 'Concentrado',
    icon: Brain,
    color: 'from-blue-400 to-indigo-500',
    genres: ['Classical', 'Instrumental', 'Ambient', 'Lo-Fi'],
    description: 'Sin distracciones para productividad'
  },
  {
    id: 'romantic',
    name: 'Romántico',
    icon: Sun,
    color: 'from-pink-400 to-rose-500',
    genres: ['R&B', 'Soul', 'Ballad', 'Jazz'],
    description: 'Momentos especiales con quien amas'
  },
  {
    id: 'melancholic',
    name: 'Melancólico',
    icon: CloudRain,
    color: 'from-gray-400 to-blue-500',
    genres: ['Indie', 'Alternative', 'Blues', 'Folk'],
    description: 'Para días de introspección'
  },
  {
    id: 'party',
    name: 'Fiesta',
    icon: Music,
    color: 'from-purple-500 to-fuchsia-500',
    genres: ['Dance', 'Electronic', 'Reggaeton', 'Pop'],
    description: 'El ritmo no para'
  },
  {
    id: 'sleepy',
    name: 'Dormir',
    icon: Moon,
    color: 'from-indigo-400 to-violet-600',
    genres: ['Ambient', 'Classical', 'Nature', 'Meditation'],
    description: 'Música suave para descansar'
  }
]

export default function MoodDetector({ 
  songs, 
  currentMood, 
  onMoodChange,
  onPlay,
  onAddToQueue 
}: MoodDetectorProps) {
  const [selectedMood, setSelectedMood] = useState<string>(currentMood || 'happy')
  const [, setListeningTime] = useState(0)

  // Auto-detect mood based on listening patterns
  useEffect(() => {
    const timer = setInterval(() => {
      setListeningTime(prev => prev + 1)
    }, 60000) // Every minute
    
    return () => clearInterval(timer)
  }, [])

  const getSongsForMood = (moodId: string) => {
    const mood = MOODS.find(m => m.id === moodId)
    if (!mood) return []
    
    return songs.filter(song => mood.genres.includes(song.genre))
  }

  const moodSongs = getSongsForMood(selectedMood)
  const currentMoodData = MOODS.find(m => m.id === selectedMood)

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId)
    onMoodChange(moodId)
  }

  const playMoodPlaylist = () => {
    if (moodSongs.length > 0) {
      onPlay(moodSongs[0])
      moodSongs.slice(1).forEach(song => onAddToQueue(song))
    }
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Detector de Estado de Ánimo</h2>
          <p className="text-white/60">La música perfecta para cómo te sientes</p>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {MOODS.map(mood => {
          const Icon = mood.icon
          const isSelected = selectedMood === mood.id
          
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`glass-premium rounded-2xl p-6 text-left transition-all ${
                isSelected 
                  ? 'border-gold-400/50 bg-gradient-to-br ' + mood.color + ' bg-opacity-10' 
                  : 'hover:border-white/20'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mood.color} flex items-center justify-center mb-4`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{mood.name}</h3>
              <p className="text-white/60 text-sm">{mood.description}</p>
              {isSelected && (
                <div className="mt-3 flex items-center gap-1 text-gold-400 text-sm">
                  <Activity className="w-4 h-4" />
                  <span>Seleccionado</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Current Mood Playlist */}
      {currentMoodData && (
        <div className="glass-premium rounded-3xl p-8 border-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentMoodData.color} flex items-center justify-center`}>
                <currentMoodData.icon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Modo {currentMoodData.name}</h3>
                <p className="text-white/60">{moodSongs.length} canciones recomendadas</p>
                <div className="flex items-center gap-2 mt-2">
                  {currentMoodData.genres.map(genre => (
                    <span key={genre} className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={playMoodPlaylist}
              disabled={moodSongs.length === 0}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all disabled:opacity-50"
            >
              <Music className="w-5 h-5" />
              Reproducir Todo
            </button>
          </div>

          {/* Song List */}
          {moodSongs.length > 0 ? (
            <div className="space-y-2">
              {moodSongs.slice(0, 15).map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                >
                  <span className="w-8 text-center text-white/40 font-medium">{index + 1}</span>
                  <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{song.title}</h4>
                    <p className="text-white/60 text-sm truncate">{song.artist} • {song.genre}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onPlay(song)}
                      className="p-2 rounded-lg bg-gold-500 text-black hover:bg-gold-400 transition-all"
                    >
                      <Music className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onAddToQueue(song)}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                      <Wind className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <currentMoodData.icon className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <p className="text-xl text-white font-semibold mb-2">No hay canciones</p>
              <p className="text-white/60">No encontramos canciones para este estado de ánimo</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
