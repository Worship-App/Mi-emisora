import { useState, useEffect } from 'react'
import { Radio, Play, Pause, Volume2, Heart, Signal, SignalHigh, RadioTower, Star, Info } from 'lucide-react'

interface RadioStation {
  id: string
  name: string
  genre: string
  country: string
  streamUrl: string
  logo: string
  listeners: number
  isOnline: boolean
  bitrate: number
  language: string
}

const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'los40',
    name: 'Los 40 Principales',
    genre: 'Pop',
    country: 'España',
    streamUrl: 'https://stream.mediaserver.es/los40',
    logo: 'https://via.placeholder.com/100?text=LOS40',
    listeners: 2500000,
    isOnline: true,
    bitrate: 128,
    language: 'Español'
  },
  {
    id: 'kissfm',
    name: 'Kiss FM',
    genre: 'Dance/Electronic',
    country: 'España',
    streamUrl: 'https://kissfm.kissfmradio.cires21.com/kissfm.mp3',
    logo: 'https://via.placeholder.com/100?text=KISS',
    listeners: 1200000,
    isOnline: true,
    bitrate: 192,
    language: 'Español'
  },
  {
    id: 'rockfm',
    name: 'Rock FM',
    genre: 'Rock',
    country: 'España',
    streamUrl: 'https://rockfm.ice.infomaniak.ch/rockfm.mp3',
    logo: 'https://via.placeholder.com/100?text=ROCK',
    listeners: 800000,
    isOnline: true,
    bitrate: 128,
    language: 'Español'
  },
  {
    id: 'cadena100',
    name: 'Cadena 100',
    genre: 'Pop/Rock',
    country: 'España',
    streamUrl: 'https://cadena100-streamers-mp3-low.flumotion.com/cope/cadena100-low.mp3',
    logo: 'https://via.placeholder.com/100?text=C100',
    listeners: 1500000,
    isOnline: true,
    bitrate: 128,
    language: 'Español'
  },
  {
    id: 'ser',
    name: 'Cadena SER',
    genre: 'Noticias/Música',
    country: 'España',
    streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/CADENASER.mp3',
    logo: 'https://via.placeholder.com/100?text=SER',
    listeners: 3000000,
    isOnline: true,
    bitrate: 128,
    language: 'Español'
  },
  {
    id: 'cope',
    name: 'COPE',
    genre: 'Noticias/Música',
    country: 'España',
    streamUrl: 'https://net1.cope.stream.flumotion.com/cope/net1.mp3',
    logo: 'https://via.placeholder.com/100?text=COPE',
    listeners: 1800000,
    isOnline: true,
    bitrate: 128,
    language: 'Español'
  },
  {
    id: 'ondaCero',
    name: 'Onda Cero',
    genre: 'Noticias/Música',
    country: 'España',
    streamUrl: 'https://livefastly-ondcero.oasisoasisfm.com/ondcero/mp3',
    logo: 'https://via.placeholder.com/100?text=OndaCero',
    listeners: 900000,
    isOnline: true,
    bitrate: 128,
    language: 'Español'
  },
  {
    id: 'radiomaria',
    name: 'Radio María',
    genre: 'Religiosa',
    country: 'España',
    streamUrl: 'https://dreamsiteradiocp5.com/proxy/rmspain',
    logo: 'https://via.placeholder.com/100?text=RM',
    listeners: 500000,
    isOnline: true,
    bitrate: 64,
    language: 'Español'
  },
  {
    id: 'esradio',
    name: 'esRadio',
    genre: 'Noticias/Música',
    country: 'España',
    streamUrl: 'https://libertaddigital-radio-live1.flumotion.com/libertaddigital/ld-live1.mp3',
    logo: 'https://via.placeholder.com/100?text=esR',
    listeners: 400000,
    isOnline: true,
    bitrate: 128,
    language: 'Español'
  },
  {
    id: 'maxima',
    name: 'Máxima FM',
    genre: 'Dance',
    country: 'España',
    streamUrl: 'https://stream.mediaserver.es/maxima',
    logo: 'https://via.placeholder.com/100?text=MAX',
    listeners: 600000,
    isOnline: true,
    bitrate: 128,
    language: 'Español'
  },
  {
    id: 'europa',
    name: 'Europa FM',
    genre: 'Pop',
    country: 'España',
    streamUrl: 'https://livefastly-redirect.europafm.com/europafm/mp3',
    logo: 'https://via.placeholder.com/100?text=EUROPA',
    listeners: 1100000,
    isOnline: true,
    bitrate: 128,
    language: 'Español'
  },
  {
    id: 'melodia',
    name: 'Melodía FM',
    genre: 'Romántica',
    country: 'España',
    streamUrl: 'https://livefastly-melodia.oasisoasisfm.com/melodia/mp3',
    logo: 'https://via.placeholder.com/100?text=MELO',
    listeners: 300000,
    isOnline: true,
    bitrate: 128,
    language: 'Español'
  }
]

interface RadioFMProps {
  onPlayStation: (station: RadioStation) => void
  currentStation: RadioStation | null
  isPlaying: boolean
  onTogglePlay: () => void
}

export default function RadioFM({ 
  onPlayStation, 
  currentStation, 
  isPlaying, 
  onTogglePlay 
}: RadioFMProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [volume, setVolume] = useState(0.7)
  const [showStationInfo, setShowStationInfo] = useState<RadioStation | null>(null)

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('radioFavorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('radioFavorites', JSON.stringify(favorites))
  }, [favorites])

  const genres = ['all', ...new Set(RADIO_STATIONS.map(s => s.genre))]

  const filteredStations = RADIO_STATIONS.filter(station => {
    const matchesGenre = selectedGenre === 'all' || station.genre === selectedGenre
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         station.country.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGenre && matchesSearch
  })

  const favoriteStations = RADIO_STATIONS.filter(s => favorites.includes(s.id))

  const toggleFavorite = (stationId: string) => {
    setFavorites(prev => 
      prev.includes(stationId) 
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId]
    )
  }

  const formatListeners = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <RadioTower className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Radio FM</h2>
            <p className="text-white/60">Escucha radio en vivo</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar emisora..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-gold-400 focus:outline-none w-full md:w-64"
          />
          <Radio className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        </div>
      </div>

      {/* Current Playing Station */}
      {currentStation && (
        <div className="glass-premium rounded-3xl p-6 mb-8 border-glow border-gold-400/30">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shrink-0">
              <Radio className="w-12 h-12 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium flex items-center gap-1">
                  <Signal className="w-3 h-3" />
                  EN VIVO
                </span>
                <span className="text-white/50 text-sm">{currentStation.bitrate} kbps</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{currentStation.name}</h3>
              <p className="text-white/60">{currentStation.genre} • {currentStation.country}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onTogglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 flex items-center justify-center hover:shadow-lg hover:shadow-gold-500/25 transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-black" />
                ) : (
                  <Play className="w-8 h-8 text-black ml-1" />
                )}
              </button>

              <button
                onClick={() => toggleFavorite(currentStation.id)}
                className={`p-4 rounded-full transition-all ${
                  favorites.includes(currentStation.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Heart className={`w-6 h-6 ${favorites.includes(currentStation.id) ? 'fill-current' : ''}`} />
              </button>

              <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
                <Volume2 className="w-5 h-5 text-white/70" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24 accent-gold-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-5 py-2.5 rounded-xl transition-all capitalize ${
              selectedGenre === genre
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {genre === 'all' ? 'Todas' : genre}
          </button>
        ))}
      </div>

      {/* Favorites Section */}
      {favoriteStations.length > 0 && (
        <>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-gold-400" />
            Favoritas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {favoriteStations.map(station => (
              <div
                key={station.id}
                onClick={() => onPlayStation(station)}
                className={`glass-premium rounded-2xl p-4 cursor-pointer transition-all hover:border-gold-400/30 ${
                  currentStation?.id === station.id ? 'border-gold-400/50 bg-gold-500/5' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <Radio className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate">{station.name}</h4>
                    <p className="text-white/60 text-sm">{station.genre}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Signal className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-white/50">{formatListeners(station.listeners)} oyentes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* All Stations */}
      <h3 className="text-xl font-bold text-white mb-4">Todas las Emisoras</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStations.map(station => (
          <div
            key={station.id}
            className={`glass-premium rounded-2xl p-4 transition-all hover:border-gold-400/30 group ${
              currentStation?.id === station.id ? 'border-gold-400/50 bg-gold-500/5' : ''
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div 
                onClick={() => onPlayStation(station)}
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center cursor-pointer shrink-0"
              >
                <Radio className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold truncate">{station.name}</h4>
                <p className="text-white/60 text-sm">{station.genre}</p>
                <p className="text-white/40 text-xs">{station.country}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-white/50 text-xs">
                <SignalHigh className="w-3 h-3" />
                <span>{station.bitrate} kbps</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFavorite(station.id)}
                  className={`p-2 rounded-lg transition-all ${
                    favorites.includes(station.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(station.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setShowStationInfo(station)}
                  className="p-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 transition-all"
                >
                  <Info className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onPlayStation(station)}
                  className={`p-2 rounded-lg transition-all ${
                    currentStation?.id === station.id && isPlaying
                      ? 'bg-gold-500 text-black'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {currentStation?.id === station.id && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Station Info Modal */}
      {showStationInfo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowStationInfo(null)}
        >
          <div 
            className="glass-premium-strong rounded-3xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <RadioTower className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{showStationInfo.name}</h3>
                <p className="text-white/60">{showStationInfo.genre}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-white/60">País</span>
                <span className="text-white font-medium">{showStationInfo.country}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-white/60">Idioma</span>
                <span className="text-white font-medium">{showStationInfo.language}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-white/60">Calidad</span>
                <span className="text-white font-medium">{showStationInfo.bitrate} kbps</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-white/60">Oyentes</span>
                <span className="text-white font-medium">{formatListeners(showStationInfo.listeners)}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-white/60">Estado</span>
                <span className="text-green-400 font-medium flex items-center gap-1">
                  <Signal className="w-4 h-4" />
                  En línea
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onPlayStation(showStationInfo)
                setShowStationInfo(null)
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all"
            >
              Escuchar Ahora
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
