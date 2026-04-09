import { useState } from 'react'
import { Podcast, Play, Pause, Clock, Download, Heart, Mic2, Radio } from 'lucide-react'

interface PodcastEpisode {
  id: string
  title: string
  description: string
  podcastName: string
  coverUrl: string
  duration: number
  publishedAt: string
  isDownloaded: boolean
  progress: number
  category: string
}

interface PodcastShow {
  id: string
  name: string
  description: string
  coverUrl: string
  host: string
  category: string
  episodes: number
  subscribers: number
}

const PODCAST_SHOWS: PodcastShow[] = [
  {
    id: '1',
    name: 'La Playlist Perfecta',
    description: 'Descubre las mejores canciones y artistas emergentes',
    coverUrl: 'https://via.placeholder.com/300?text=Playlist',
    host: 'María González',
    category: 'Música',
    episodes: 156,
    subscribers: 45000
  },
  {
    id: '2',
    name: 'Música y Letras',
    description: 'Análisis profundo de las letras más icónicas',
    coverUrl: 'https://via.placeholder.com/300?text=Letras',
    host: 'Carlos Ruiz',
    category: 'Cultura',
    episodes: 89,
    subscribers: 28000
  },
  {
    id: '3',
    name: 'Sonido Urbano',
    description: 'Lo mejor del hip-hop, rap y R&B',
    coverUrl: 'https://via.placeholder.com/300?text=Urbano',
    host: 'DJ Fresh',
    category: 'Urbano',
    episodes: 234,
    subscribers: 67000
  },
  {
    id: '4',
    name: 'Rock Legends',
    description: 'Historias detrás de las leyendas del rock',
    coverUrl: 'https://via.placeholder.com/300?text=Rock',
    host: 'Ana Rock',
    category: 'Rock',
    episodes: 112,
    subscribers: 52000
  }
]

const EPISODES: PodcastEpisode[] = [
  {
    id: '1',
    title: 'Los Álbumes Más Esperados del 2024',
    description: 'Repasamos los lanzamientos que marcarán el año',
    podcastName: 'La Playlist Perfecta',
    coverUrl: 'https://via.placeholder.com/100?text=EP1',
    duration: 2847,
    publishedAt: '2024-01-15',
    isDownloaded: false,
    progress: 0,
    category: 'Música'
  },
  {
    id: '2',
    title: 'El Significado de Bohemian Rhapsody',
    description: 'Análisis profundo de la obra maestra de Queen',
    podcastName: 'Música y Letras',
    coverUrl: 'https://via.placeholder.com/100?text=EP2',
    duration: 4523,
    publishedAt: '2024-01-12',
    isDownloaded: true,
    progress: 65,
    category: 'Cultura'
  },
  {
    id: '3',
    title: 'Entrevista con Bad Bunny',
    description: 'Conversación exclusiva con el artista puertorriqueño',
    podcastName: 'Sonido Urbano',
    coverUrl: 'https://via.placeholder.com/100?text=EP3',
    duration: 3654,
    publishedAt: '2024-01-10',
    isDownloaded: false,
    progress: 0,
    category: 'Urbano'
  }
]

export default function Podcasts() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [downloads, setDownloads] = useState<string[]>([])
  const [playingEpisode, setPlayingEpisode] = useState<string | null>(null)
  const [selectedShow, setSelectedShow] = useState<PodcastShow | null>(null)

  const categories = ['all', 'Música', 'Cultura', 'Urbano', 'Rock']

  const filteredShows = selectedCategory === 'all' 
    ? PODCAST_SHOWS 
    : PODCAST_SHOWS.filter(s => s.category === selectedCategory)

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleDownload = (id: string) => {
    setDownloads(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Mic2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Podcasts</h2>
            <p className="text-white/60">Series y episodios exclusivos</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-xl transition-all capitalize ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {cat === 'all' ? 'Todos' : cat}
          </button>
        ))}
      </div>

      {/* Featured Shows */}
      <h3 className="text-2xl font-bold text-white mb-6">Programas Destacados</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {filteredShows.map(show => (
          <div
            key={show.id}
            onClick={() => setSelectedShow(show)}
            className="glass-premium rounded-2xl p-6 cursor-pointer transition-all hover:border-gold-400/30"
          >
            <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Podcast className="w-16 h-16 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1 truncate">{show.name}</h4>
            <p className="text-white/60 text-sm mb-3 line-clamp-2">{show.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gold-400">{show.episodes} episodios</span>
              <span className="text-white/50">{show.subscribers.toLocaleString()} subs</span>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Episodes */}
      <h3 className="text-2xl font-bold text-white mb-6">Últimos Episodios</h3>
      <div className="space-y-4">
        {EPISODES.map(episode => {
          const isPlaying = playingEpisode === episode.id
          const isFav = favorites.includes(episode.id)
          const isDownloaded = downloads.includes(episode.id) || episode.isDownloaded

          return (
            <div key={episode.id} className="glass-premium rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  {isPlaying ? (
                    <div className="flex items-end gap-1 h-8">
                      <div className="w-1 bg-white animate-pulse h-4"></div>
                      <div className="w-1 bg-white animate-pulse h-8 delay-75"></div>
                      <div className="w-1 bg-white animate-pulse h-6 delay-150"></div>
                    </div>
                  ) : (
                    <Radio className="w-8 h-8 text-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                      {episode.category}
                    </span>
                    <span className="text-white/50 text-sm">
                      {new Date(episode.publishedAt).toLocaleDateString('es')}
                    </span>
                  </div>
                  <h4 className="text-white font-semibold truncate">{episode.title}</h4>
                  <p className="text-white/60 text-sm truncate">{episode.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(episode.duration)}
                    </span>
                    <span>{episode.podcastName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(episode.id)}
                    className={`p-2 rounded-lg transition-all ${
                      isFav ? 'bg-red-500 text-white' : 'bg-white/10 text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleDownload(episode.id)}
                    className={`p-2 rounded-lg transition-all ${
                      isDownloaded ? 'bg-green-500 text-white' : 'bg-white/10 text-white'
                    }`}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPlayingEpisode(isPlaying ? null : episode.id)}
                    className={`p-3 rounded-lg transition-all ${
                      isPlaying 
                        ? 'bg-gold-500 text-black' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {episode.progress > 0 && (
                <div className="mt-3">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gold-500 rounded-full"
                      style={{ width: `${episode.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-white/50 text-xs mt-1">{episode.progress}% escuchado</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Show Detail Modal */}
      {selectedShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-premium-strong rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                <Podcast className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{selectedShow.name}</h3>
                <p className="text-white/60 mb-2">Presentado por {selectedShow.host}</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gold-400">{selectedShow.episodes} episodios</span>
                  <span className="text-white/50">{selectedShow.subscribers.toLocaleString()} suscriptores</span>
                </div>
              </div>
            </div>

            <p className="text-white/70 mb-6">{selectedShow.description}</p>

            <button
              onClick={() => setSelectedShow(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold"
            >
              Suscribirse
            </button>

            <button
              onClick={() => setSelectedShow(null)}
              className="w-full mt-3 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
