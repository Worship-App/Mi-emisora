import { useState, useEffect } from 'react'
import { Users, Plus, Share2, Link, Copy, Check, Trash2, Music, UserPlus, Lock, Globe } from 'lucide-react'
import type { Song } from '../types'

interface CollaborativePlaylist {
  id: string
  name: string
  description: string
  createdBy: string
  members: string[]
  songs: Song[]
  isPublic: boolean
  inviteCode: string
  createdAt: string
  lastModified: string
}

interface CollaborativePlaylistsProps {
  currentUser: string
  songs: Song[]
  onPlay: (song: Song) => void
}

export default function CollaborativePlaylists({ 
  currentUser,
  songs,
  onPlay
}: CollaborativePlaylistsProps) {
  const [playlists, setPlaylists] = useState<CollaborativePlaylist[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<CollaborativePlaylist | null>(null)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [inviteCode, setInviteCode] = useState('')
  const [copied, setCopied] = useState(false)

  // Load collaborative playlists from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('collaborativePlaylists')
    if (saved) {
      setPlaylists(JSON.parse(saved))
    } else {
      // Create demo playlist
      const demo: CollaborativePlaylist = {
        id: 'demo-collab',
        name: 'Fiesta Juntos',
        description: 'Playlist colaborativa para el próximo evento',
        createdBy: 'Sistema',
        members: ['Sistema', 'Usuario'],
        songs: songs.slice(0, 10),
        isPublic: true,
        inviteCode: 'FIESTA2024',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
      setPlaylists([demo])
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('collaborativePlaylists', JSON.stringify(playlists))
  }, [playlists])

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  }

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist: CollaborativePlaylist = {
        id: Date.now().toString(),
        name: newPlaylistName.trim(),
        description: newPlaylistDesc.trim(),
        createdBy: currentUser,
        members: [currentUser],
        songs: [],
        isPublic,
        inviteCode: generateInviteCode(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
      setPlaylists(prev => [...prev, newPlaylist])
      setNewPlaylistName('')
      setNewPlaylistDesc('')
      setShowCreateModal(false)
    }
  }

  const handleJoin = () => {
    const playlist = playlists.find(p => p.inviteCode === inviteCode.toUpperCase())
    if (playlist && !playlist.members.includes(currentUser)) {
      setPlaylists(prev => prev.map(p => 
        p.id === playlist.id 
          ? { ...p, members: [...p.members, currentUser] }
          : p
      ))
      setInviteCode('')
      setShowJoinModal(false)
    }
  }

  const handleDelete = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id))
    if (selectedPlaylist?.id === id) {
      setSelectedPlaylist(null)
    }
  }

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  
  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId 
        ? { ...p, songs: p.songs.filter(s => s.id !== songId), lastModified: new Date().toISOString() }
        : p
    ))
  }

  const myPlaylists = playlists.filter(p => p.members.includes(currentUser))

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Playlists Colaborativas</h2>
            <p className="text-white/60">Crea y edita playlists con amigos</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <Link className="w-5 h-5" />
            Unirse
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            Crear
          </button>
        </div>
      </div>

      {/* Playlists Grid */}
      {myPlaylists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {myPlaylists.map(playlist => (
            <div
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist)}
              className={`glass-premium rounded-2xl p-6 cursor-pointer transition-all hover:border-gold-400/30 ${
                selectedPlaylist?.id === playlist.id ? 'border-gold-400/50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                {playlist.isPublic ? (
                  <Globe className="w-5 h-5 text-white/50" />
                ) : (
                  <Lock className="w-5 h-5 text-white/50" />
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{playlist.name}</h3>
              <p className="text-white/60 text-sm mb-3 line-clamp-2">{playlist.description}</p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-white/50">
                  <Music className="w-4 h-4" />
                  {playlist.songs.length} canciones
                </div>
                <div className="flex items-center gap-1 text-white/50">
                  <UserPlus className="w-4 h-4" />
                  {playlist.members.length} miembros
                </div>
              </div>

              {/* Invite Code */}
              {playlist.createdBy === currentUser && (
                <div className="mt-4 p-3 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs">Código de invitación</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyInviteCode(playlist.inviteCode)
                      }}
                      className="flex items-center gap-1 text-gold-400 text-sm hover:text-gold-300"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? '¡Copiado!' : playlist.inviteCode}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-premium rounded-2xl p-12 text-center mb-8">
          <Users className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-xl text-white font-semibold mb-2">No tienes playlists colaborativas</p>
          <p className="text-white/60 mb-6">Crea una nueva o únete con un código de invitación</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold"
            >
              Crear Playlist
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
            >
              Unirse
            </button>
          </div>
        </div>
      )}

      {/* Selected Playlist Detail */}
      {selectedPlaylist && (
        <div className="glass-premium rounded-3xl p-8 border-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{selectedPlaylist.name}</h3>
              <p className="text-white/60">Creada por {selectedPlaylist.createdBy}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyInviteCode(selectedPlaylist.inviteCode)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
              {selectedPlaylist.createdBy === currentUser && (
                <button
                  onClick={() => handleDelete(selectedPlaylist.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              )}
            </div>
          </div>

          {/* Members */}
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3">Miembros ({selectedPlaylist.members.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedPlaylist.members.map((member, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center text-xs text-black font-bold">
                    {member[0]}
                  </div>
                  <span className="text-white/80 text-sm">{member}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Songs */}
          <h4 className="text-white font-semibold mb-3">Canciones ({selectedPlaylist.songs.length})</h4>
          {selectedPlaylist.songs.length > 0 ? (
            <div className="space-y-2">
              {selectedPlaylist.songs.map((song, index) => (
                <div
                  key={`${song.id}-${index}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                >
                  <span className="w-8 text-center text-white/40">{index + 1}</span>
                  <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{song.title}</h4>
                    <p className="text-white/60 text-sm">{song.artist}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => onPlay(song)}
                      className="p-2 rounded-lg bg-gold-500 text-black"
                    >
                      <Music className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeSongFromPlaylist(selectedPlaylist.id, song.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-center py-8">Aún no hay canciones en esta playlist</p>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-premium-strong rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Crear Playlist Colaborativa</h3>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Nombre de la playlist"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-gold-400 focus:outline-none mb-4"
            />
            <textarea
              value={newPlaylistDesc}
              onChange={(e) => setNewPlaylistDesc(e.target.value)}
              placeholder="Descripción (opcional)"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-gold-400 focus:outline-none mb-4 resize-none"
              rows={3}
            />
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isPublic ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/70'
                }`}
              >
                {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {isPublic ? 'Pública' : 'Privada'}
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!newPlaylistName.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold disabled:opacity-50"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-premium-strong rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Unirse a Playlist</h3>
            <p className="text-white/60 mb-4">Ingresa el código de invitación</p>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="CÓDIGO-123"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-gold-400 focus:outline-none mb-6 text-center text-2xl font-mono tracking-wider"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                Cancelar
              </button>
              <button
                onClick={handleJoin}
                disabled={!inviteCode.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold disabled:opacity-50"
              >
                Unirse
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
