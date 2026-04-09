import { useState } from 'react'
import { Plus, Trash2, Play, ListMusic, X } from 'lucide-react'
import type { Song, Playlist } from '../types'

interface PlaylistsProps {
  playlists: Playlist[]
  currentSong: Song | null
  isPlaying: boolean
  onPlay: (song: Song) => void
  onCreatePlaylist: (name: string) => void
  onDeletePlaylist: (id: string) => void
  onAddToPlaylist: (song: Song, playlistId: string) => void
}

export default function Playlists({ 
  playlists, 
  currentSong, 
  isPlaying, 
  onPlay, 
  onCreatePlaylist,
  onDeletePlaylist
}: PlaylistsProps) {
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null)

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim())
      setNewPlaylistName('')
      setShowCreateForm(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <ListMusic className="w-8 h-8 text-secondary-500" />
          <span className="gradient-text">Mis Listas</span>
        </h2>
        
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium hover:shadow-lg transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Nueva Lista
        </button>
      </div>

      {/* Create Playlist Form */}
      {showCreateForm && (
        <div className="glass-effect rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Nombre de la lista..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
              className="flex-1 px-4 py-2 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <button
              onClick={handleCreatePlaylist}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium"
            >
              Crear
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {playlists.length === 0 ? (
        <div className="glass-effect rounded-3xl p-12 text-center">
          <ListMusic className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No tienes listas aún
          </h3>
          <p className="text-gray-400">
            Crea tu primera lista de reproducción
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {playlists.map((playlist) => {
            const isExpanded = expandedPlaylist === playlist.id
            const totalDuration = playlist.songs.reduce((acc, s) => acc + s.duration, 0)

            return (
              <div 
                key={playlist.id}
                className="glass-effect rounded-2xl overflow-hidden"
              >
                {/* Playlist Header */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedPlaylist(isExpanded ? null : playlist.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <ListMusic className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{playlist.name}</h3>
                      <p className="text-sm text-gray-400">
                        {playlist.songs.length} canciones • {formatDuration(totalDuration)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {playlist.songs.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onPlay(playlist.songs[0])
                        }}
                        className="p-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg transition-shadow"
                      >
                        <Play className="w-5 h-5 fill-current" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeletePlaylist(playlist.id)
                      }}
                      className="p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Playlist Songs */}
                {isExpanded && playlist.songs.length > 0 && (
                  <div className="border-t border-white/10">
                    {playlist.songs.map((song, index) => {
                      const isCurrentSong = currentSong?.id === song.id

                      return (
                        <div 
                          key={`${playlist.id}-${song.id}-${index}`}
                          className={`flex items-center gap-3 p-3 hover:bg-white/5 transition-colors ${
                            isCurrentSong ? 'bg-primary-500/20' : ''
                          }`}
                        >
                          <span className="w-6 text-center text-gray-500 text-sm">
                            {index + 1}
                          </span>
                          <img 
                            src={song.coverUrl} 
                            alt={song.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium truncate ${isCurrentSong ? 'text-primary-400' : 'text-white'}`}>
                              {song.title}
                            </h4>
                            <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDuration(song.duration)}
                          </span>
                          <button
                            onClick={() => onPlay(song)}
                            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            {isCurrentSong && isPlaying ? (
                              <div className="flex items-end gap-0.5 h-4">
                                <span className="audio-bar h-2" />
                                <span className="audio-bar h-3" />
                                <span className="audio-bar h-2" />
                              </div>
                            ) : (
                              <Play className="w-4 h-4 fill-current" />
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
