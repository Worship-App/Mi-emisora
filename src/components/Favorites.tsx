import { Play, Heart, Trash2 } from 'lucide-react'
import type { Song } from '../types'

interface FavoritesProps {
  favorites: Song[]
  currentSong: Song | null
  isPlaying: boolean
  onPlay: (song: Song) => void
  onToggleFavorite: (song: Song) => void
  onRemove: (song: Song) => void
}

export default function Favorites({ 
  favorites, 
  currentSong, 
  isPlaying, 
  onPlay,
  onRemove
}: FavoritesProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Heart className="w-8 h-8 text-red-500 fill-current" />
        <span className="gradient-text">Mis Favoritos</span>
        <span className="text-lg text-gray-400 font-normal">
          ({favorites.length} canciones)
        </span>
      </h2>

      {favorites.length === 0 ? (
        <div className="glass-effect rounded-3xl p-12 text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No tienes favoritos aún
          </h3>
          <p className="text-gray-400">
            Marca canciones con el corazón para verlas aquí
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((song) => {
            const isCurrentSong = currentSong?.id === song.id

            return (
              <div 
                key={song.id}
                className={`glass-effect rounded-2xl p-4 hover-lift transition-all duration-300 group ${
                  isCurrentSong ? 'ring-2 ring-red-500' : ''
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
                    <h3 className={`font-semibold truncate ${isCurrentSong ? 'text-red-400' : 'text-white'}`}>
                      {song.title}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDuration(song.duration)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => onRemove(song)}
                      className="p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
