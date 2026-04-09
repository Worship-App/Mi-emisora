import { useState, useMemo } from 'react'
import { Play, Heart, Plus, Search, Clock, Calendar, Music, Filter, ChevronDown } from 'lucide-react'
import type { Song, Playlist } from '../types'
import ShareButtons from './ShareButtons'

interface SongListProps {
  songs: Song[]
  currentSong: Song | null
  isPlaying: boolean
  favorites: Song[]
  onPlay: (song: Song) => void
  onToggleFavorite: (song: Song) => void
  onAddToPlaylist: (song: Song, playlistId: string) => void
  onAddToQueue?: (song: Song) => void
  playlists: Playlist[]
}

export default function SongList({ 
  songs, 
  currentSong, 
  isPlaying, 
  favorites, 
  onPlay, 
  onToggleFavorite,
  onAddToPlaylist,
  onAddToQueue,
  playlists
}: SongListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedArtist, setSelectedArtist] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddToPlaylist, setShowAddToPlaylist] = useState<string | null>(null)

  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(songs.map(s => s.genre))]
    return ['all', ...uniqueGenres]
  }, [songs])

  const years = useMemo(() => {
    const uniqueYears = [...new Set(songs.map(s => s.year.toString()))].sort((a, b) => parseInt(b) - parseInt(a))
    return ['all', ...uniqueYears]
  }, [songs])

  const artists = useMemo(() => {
    const uniqueArtists = [...new Set(songs.map(s => s.artist))].sort()
    return ['all', ...uniqueArtists]
  }, [songs])

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          song.album.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGenre = selectedGenre === 'all' || song.genre === selectedGenre
      const matchesYear = selectedYear === 'all' || song.year.toString() === selectedYear
      const matchesArtist = selectedArtist === 'all' || song.artist === selectedArtist
      return matchesSearch && matchesGenre && matchesYear && matchesArtist
    })
  }, [songs, searchQuery, selectedGenre, selectedYear, selectedArtist])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <section>
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar canciones, artistas o álbumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl glass-premium text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:glow-gold transition-all duration-300"
          />
        </div>
        
        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-premium text-white/70 hover:text-white transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros avanzados</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {showFilters && (
          <div className="glass-premium rounded-2xl p-4 space-y-4">
            {/* Genre Filters */}
            <div>
              <p className="text-xs text-white/50 uppercase mb-2">Género</p>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedGenre === genre
                        ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-black'
                        : 'bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    {genre === 'all' ? 'Todos' : genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <p className="text-xs text-white/50 uppercase mb-2">Año</p>
              <div className="flex flex-wrap gap-2">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedYear === year
                        ? 'bg-gradient-to-r from-neon-pink to-neon-cyan text-black'
                        : 'bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    {year === 'all' ? 'Todos' : year}
                  </button>
                ))}
              </div>
            </div>

            {/* Artist Filter */}
            <div>
              <p className="text-xs text-white/50 uppercase mb-2">Artista</p>
              <select
                value={selectedArtist}
                onChange={(e) => setSelectedArtist(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/30 text-white border border-white/10 focus:outline-none focus:border-gold-400"
              >
                {artists.map(artist => (
                  <option key={artist} value={artist} className="bg-gray-900">
                    {artist === 'all' ? 'Todos los artistas' : artist}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedGenre('all')
                setSelectedYear('all')
                setSelectedArtist('all')
                setSearchQuery('')
              }}
              className="w-full py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 flex items-center gap-6 text-sm text-gray-400">
        <span className="flex items-center gap-2">
          <Music className="w-4 h-4" />
          {filteredSongs.length} canciones
        </span>
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {formatDuration(filteredSongs.reduce((acc, s) => acc + s.duration, 0))} total
        </span>
      </div>

      {/* Song Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSongs.map((song) => {
          const isCurrentSong = currentSong?.id === song.id
          const isFavorite = favorites.some(f => f.id === song.id)

          return (
            <div 
              key={song.id}
              className={`card-premium p-5 transition-all duration-300 ${
                isCurrentSong ? 'ring-2 ring-gold-400 glow-gold' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Cover */}
                <div className="relative">
                  <img 
                    src={song.coverUrl} 
                    alt={song.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <button
                    onClick={() => onPlay(song)}
                    className={`absolute inset-0 rounded-xl flex items-center justify-center transition-opacity ${
                      isCurrentSong && isPlaying ? 'opacity-100 bg-black/50' : 'opacity-0 group-hover:opacity-100 bg-black/40'
                    }`}
                  >
                    {isCurrentSong && isPlaying ? (
                      <div className="flex items-end gap-1 h-6">
                        <span className="audio-bar h-3" />
                        <span className="audio-bar h-5" />
                        <span className="audio-bar h-4" />
                        <span className="audio-bar h-6" />
                        <span className="audio-bar h-3" />
                      </div>
                    ) : (
                      <Play className="w-8 h-8 text-white fill-current" />
                    )}
                  </button>
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${isCurrentSong ? 'text-primary-400' : 'text-white'}`}>
                    {song.title}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{song.year}</span>
                    <span>•</span>
                    <span>{song.genre}</span>
                    <span>•</span>
                    <span>{formatDuration(song.duration)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onToggleFavorite(song)}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  
                  {/* Add to Queue Button */}
                  {onAddToQueue && (
                    <button
                      onClick={() => onAddToQueue(song)}
                      className="p-2 rounded-full text-gray-400 hover:text-gold-400 transition-colors"
                      title="Agregar a la cola"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M3 12h18" />
                        <path d="M3 18h18" />
                        <path d="M8 6v12" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Share Button */}
                  <ShareButtons song={song} />
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowAddToPlaylist(showAddToPlaylist === song.id ? null : song.id)}
                      className="p-2 rounded-full text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    
                    {showAddToPlaylist === song.id && playlists.length > 0 && (
                      <div className="absolute right-0 bottom-full mb-2 w-48 glass-effect rounded-xl p-2 z-10">
                        <p className="text-xs text-gray-400 px-2 py-1">Añadir a lista:</p>
                        {playlists.map(playlist => (
                          <button
                            key={playlist.id}
                            onClick={() => {
                              onAddToPlaylist(song, playlist.id)
                              setShowAddToPlaylist(null)
                            }}
                            className="w-full text-left px-2 py-1 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
                          >
                            {playlist.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No se encontraron canciones</p>
          <p className="text-gray-500 text-sm mt-2">Intenta con otra búsqueda</p>
        </div>
      )}
    </section>
  )
}
