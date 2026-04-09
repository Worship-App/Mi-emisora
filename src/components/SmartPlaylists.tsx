import { useState, useMemo } from 'react'
import { Zap, RefreshCw, Heart, Music, Sparkles, Play, Plus, Wind, Sun, Dumbbell, Coffee } from 'lucide-react'
import type { Song } from '../types'

interface SmartPlaylistsProps {
  songs: Song[]
  favorites: Song[]
  history: Song[]
  onPlay: (song: Song) => void
  onAddToQueue: (song: Song) => void
  onCreatePlaylist: (name: string, songs: Song[]) => void
}

type SmartPlaylistType = 'daily' | 'discover' | 'favorites' | 'recent' | 'mood'

interface SmartPlaylist {
  id: string
  type: SmartPlaylistType
  name: string
  description: string
  icon: React.ElementType
  color: string
  songs: Song[]
  generatedAt: string
}

export default function SmartPlaylists({ 
  songs, 
  favorites, 
  history,
  onPlay, 
  onAddToQueue,
  onCreatePlaylist 
}: SmartPlaylistsProps) {
  const [selectedType, setSelectedType] = useState<SmartPlaylistType>('daily')
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate smart playlists based on different criteria
  const smartPlaylists = useMemo((): SmartPlaylist[] => {
    const playlists: SmartPlaylist[] = []

    // 1. Daily Mix - Based on recent listening + favorites
    const dailyMixSongs = useMemo(() => {
      const recentGenres = new Set(history.slice(0, 20).map(h => h.genre))
      const favSongs = favorites.filter(f => recentGenres.has(f.genre))
      const similarSongs = songs.filter(s => 
        recentGenres.has(s.genre) && 
        !favorites.some(f => f.id === s.id)
      ).slice(0, 15)
      
      return [...favSongs.slice(0, 10), ...similarSongs]
        .sort(() => Math.random() - 0.5)
        .slice(0, 20)
    }, [favorites, history, songs])

    playlists.push({
      id: 'daily-mix',
      type: 'daily',
      name: 'Mix Diario',
      description: 'Basado en tu historial reciente',
      icon: Sun,
      color: 'from-orange-400 to-yellow-400',
      songs: dailyMixSongs,
      generatedAt: new Date().toISOString()
    })

    // 2. Discovery Mix - New songs not in history
    const discoverySongs = useMemo(() => {
      const historyIds = new Set(history.map(h => h.id))
      const favGenres = new Set(favorites.map(f => f.genre))
      return songs
        .filter(s => !historyIds.has(s.id) && favGenres.has(s.genre))
        .sort(() => Math.random() - 0.5)
        .slice(0, 25)
    }, [songs, history, favorites])

    playlists.push({
      id: 'discover-mix',
      type: 'discover',
      name: 'Descubrimiento',
      description: 'Nuevas canciones para ti',
      icon: Sparkles,
      color: 'from-purple-400 to-pink-400',
      songs: discoverySongs,
      generatedAt: new Date().toISOString()
    })

    // 3. Favorites Replay - Most played favorites
    const favoritesMix = useMemo(() => {
      return [...favorites]
        .sort(() => Math.random() - 0.5)
        .slice(0, 30)
    }, [favorites])

    playlists.push({
      id: 'favorites-mix',
      type: 'favorites',
      name: 'Favoritos Replay',
      description: 'Tus favoritos en orden aleatorio',
      icon: Heart,
      color: 'from-red-400 to-pink-400',
      songs: favoritesMix,
      generatedAt: new Date().toISOString()
    })

    // 4. Recently Played
    const recentMix = useMemo(() => {
      return history
        .slice(0, 25)
        .filter((song, index, self) => 
          index === self.findIndex(s => s.id === song.id)
        )
    }, [history])

    playlists.push({
      id: 'recent-mix',
      type: 'recent',
      name: 'Escuchado Recientemente',
      description: 'Las últimas canciones que disfrutaste',
      icon: RefreshCw,
      color: 'from-blue-400 to-cyan-400',
      songs: recentMix,
      generatedAt: new Date().toISOString()
    })

    // 5. Mood-based playlists
    const moodPlaylists = [
      { 
        id: 'mood-relax', 
        name: 'Modo Relax', 
        icon: Wind,
        color: 'from-teal-400 to-green-400',
        filter: (s: Song) => ['Ambient', 'Chill', 'Jazz', 'Classical'].includes(s.genre)
      },
      { 
        id: 'mood-workout', 
        name: 'Workout Energy', 
        icon: Dumbbell,
        color: 'from-orange-500 to-red-500',
        filter: (s: Song) => ['Rock', 'Electronic', 'Pop', 'Hip Hop'].includes(s.genre)
      },
      { 
        id: 'mood-focus', 
        name: 'Focus Flow', 
        icon: Coffee,
        color: 'from-indigo-400 to-purple-400',
        filter: (s: Song) => ['Classical', 'Ambient', 'Jazz', 'Instrumental'].includes(s.genre)
      },
      { 
        id: 'mood-party', 
        name: 'Party Mode', 
        icon: Music,
        color: 'from-pink-500 to-rose-500',
        filter: (s: Song) => ['Pop', 'Electronic', 'Dance', 'Reggaeton'].includes(s.genre)
      }
    ]

    moodPlaylists.forEach(mood => {
      const moodSongs = songs.filter(mood.filter).slice(0, 20)
      if (moodSongs.length > 0) {
        playlists.push({
          id: mood.id,
          type: 'mood',
          name: mood.name,
          description: `Perfecto para ${mood.name.toLowerCase()}`,
          icon: mood.icon,
          color: mood.color,
          songs: moodSongs,
          generatedAt: new Date().toISOString()
        })
      }
    })

    return playlists
  }, [songs, favorites, history])

  const currentPlaylist = smartPlaylists.find(p => p.type === selectedType) || smartPlaylists[0]

  const regenerate = () => {
    setIsGenerating(true)
    setTimeout(() => setIsGenerating(false), 1000)
  }

  const saveAsPlaylist = () => {
    if (currentPlaylist) {
      onCreatePlaylist(currentPlaylist.name, currentPlaylist.songs)
    }
  }

  const playAll = () => {
    if (currentPlaylist?.songs.length > 0) {
      onPlay(currentPlaylist.songs[0])
      currentPlaylist.songs.slice(1).forEach(song => onAddToQueue(song))
    }
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Smart Playlists</h2>
            <p className="text-white/60">Generadas automáticamente para ti</p>
          </div>
        </div>

        <button
          onClick={regenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="text-white">Regenerar</span>
        </button>
      </div>

      {/* Playlist Type Selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { type: 'daily', label: 'Mix Diario', icon: Sun },
          { type: 'discover', label: 'Descubrir', icon: Sparkles },
          { type: 'favorites', label: 'Favoritos', icon: Heart },
          { type: 'recent', label: 'Reciente', icon: RefreshCw },
          { type: 'mood', label: 'Por Estado', icon: Music }
        ].map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => setSelectedType(type as SmartPlaylistType)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
              selectedType === type
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Current Playlist Card */}
      {currentPlaylist && (
        <div className="glass-premium rounded-3xl p-8 mb-8 border-glow">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Playlist Cover */}
            <div className={`w-48 h-48 rounded-2xl bg-gradient-to-br ${currentPlaylist.color} flex items-center justify-center shrink-0`}>
              <currentPlaylist.icon className="w-24 h-24 text-white" />
            </div>

            {/* Playlist Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-sm font-medium">
                  Auto-generada
                </span>
                <span className="text-white/50 text-sm">
                  {currentPlaylist.songs.length} canciones
                </span>
              </div>

              <h3 className="text-4xl font-bold text-white mb-2">
                {currentPlaylist.name}
              </h3>
              <p className="text-white/70 text-lg mb-6">
                {currentPlaylist.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={playAll}
                  disabled={currentPlaylist.songs.length === 0}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all disabled:opacity-50"
                >
                  <Play className="w-5 h-5" />
                  Reproducir Todo
                </button>

                <button
                  onClick={saveAsPlaylist}
                  disabled={currentPlaylist.songs.length === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all disabled:opacity-50"
                >
                  <Plus className="w-5 h-5" />
                  Guardar como Playlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Song List */}
      {isGenerating ? (
        <div className="glass-premium rounded-2xl p-12 text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 text-white/30 animate-spin" />
          <p className="text-xl text-white font-semibold">Generando playlist...</p>
        </div>
      ) : (
        <div className="glass-premium rounded-2xl overflow-hidden">
          {currentPlaylist?.songs.length === 0 ? (
            <div className="p-12 text-center">
              <Music className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <p className="text-xl text-white font-semibold mb-2">Sin canciones</p>
              <p className="text-white/60">
                No hay suficientes canciones para este tipo de playlist
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {currentPlaylist?.songs.map((song, index) => (
                <div
                  key={`${song.id}-${index}`}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all group"
                >
                  <span className="w-8 text-center text-white/40 text-sm font-medium">
                    {index + 1}
                  </span>

                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{song.title}</h4>
                    <p className="text-white/60 text-sm truncate">{song.artist}</p>
                  </div>

                  <span className="text-white/40 text-sm">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </span>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onPlay(song)}
                      className="p-2 rounded-lg bg-gold-500 text-black hover:bg-gold-400 transition-all"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onAddToQueue(song)}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Smart Playlists Grid */}
      <h3 className="text-2xl font-bold text-white mt-12 mb-6">Todas las Smart Playlists</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {smartPlaylists.map(playlist => (
          <button
            key={playlist.id}
            onClick={() => setSelectedType(playlist.type)}
            className={`glass-premium rounded-2xl p-6 text-left transition-all hover:border-gold-400/30 ${
              selectedType === playlist.type ? 'border-gold-400/50 bg-gold-500/5' : ''
            }`}
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${playlist.color} flex items-center justify-center mb-4`}>
              <playlist.icon className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">{playlist.name}</h4>
            <p className="text-white/60 text-sm mb-3">{playlist.description}</p>
            <span className="text-white/40 text-sm">{playlist.songs.length} canciones</span>
          </button>
        ))}
      </div>
    </section>
  )
}
