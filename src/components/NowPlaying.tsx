import { useState, useEffect } from 'react'
import { Radio, Users, Share2, Headphones, Activity, Music2, Heart, Clock } from 'lucide-react'
import type { Song } from '../types'

interface NowPlayingProps {
  currentSong: Song | null
  isPlaying: boolean
  listeners: number
  onShare: () => void
}

interface FriendActivity {
  id: string
  name: string
  avatar: string
  song: Song | null
  isPlaying: boolean
  timestamp: string
}

export default function NowPlaying({ 
  currentSong, 
  isPlaying,
  listeners,
  onShare 
}: NowPlayingProps) {
  const [friends, setFriends] = useState<FriendActivity[]>([])
  const [showShareModal, setShowShareModal] = useState(false)
  const [isListeningAlong, setIsListeningAlong] = useState(false)

  // Simulate friends activity
  useEffect(() => {
    const mockFriends: FriendActivity[] = [
      { id: '1', name: 'María', avatar: '👩', song: currentSong, isPlaying: true, timestamp: 'Ahora' },
      { id: '2', name: 'Carlos', avatar: '👨', song: null, isPlaying: false, timestamp: 'Hace 5 min' },
      { id: '3', name: 'Ana', avatar: '👩‍🦰', song: currentSong, isPlaying: true, timestamp: 'Ahora' },
      { id: '4', name: 'Pedro', avatar: '👨‍🦱', song: null, isPlaying: false, timestamp: 'Hace 15 min' },
    ]
    setFriends(mockFriends)
  }, [currentSong])

  const playingFriends = friends.filter(f => f.isPlaying && f.song)
  const listeningCount = playingFriends.length + Math.floor(Math.random() * 50)

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
          <Radio className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Escuchando Ahora</h2>
          <p className="text-white/60">Comparte tu actividad musical en tiempo real</p>
        </div>
      </div>

      {/* Current Song Card */}
      {currentSong && (
        <div className="glass-premium rounded-3xl p-8 mb-8 border-glow">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative">
              <img 
                src={currentSong.coverUrl} 
                alt={currentSong.title}
                className={`w-48 h-48 rounded-2xl object-cover ${isPlaying ? 'animate-pulse' : ''}`}
              />
              {isPlaying && (
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium flex items-center gap-1">
                  <Radio className="w-3 h-3" />
                  EN VIVO
                </span>
                <span className="text-white/50 text-sm">
                  {listeners.toLocaleString()} oyentes
                </span>
              </div>

              <h3 className="text-3xl font-bold text-white mb-1">{currentSong.title}</h3>
              <p className="text-xl text-white/70 mb-4">{currentSong.artist}</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowShareModal(true)
                    onShare()
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Compartir
                </button>

                <button
                  onClick={() => setIsListeningAlong(!isListeningAlong)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    isListeningAlong 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Headphones className="w-5 h-5" />
                  {isListeningAlong ? 'Escuchando' : 'Escuchar Juntos'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-premium rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-white">{listeningCount.toLocaleString()}</p>
          <p className="text-white/60 text-sm">Escuchando ahora</p>
        </div>

        <div className="glass-premium rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-white">{Math.floor(listeningCount * 0.7)}</p>
          <p className="text-white/60 text-sm">Me gusta hoy</p>
        </div>

        <div className="glass-premium rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-white">{Math.floor(listeningCount * 0.3)}</p>
          <p className="text-white/60 text-sm">Compartidos hoy</p>
        </div>

        <div className="glass-premium rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-white">{Math.floor(listeners / 60)}h</p>
          <p className="text-white/60 text-sm">Tiempo de escucha</p>
        </div>
      </div>

      {/* Friends Activity */}
      <h3 className="text-2xl font-bold text-white mb-6">Actividad de Amigos</h3>
      <div className="space-y-4">
        {friends.map(friend => (
          <div key={friend.id} className="glass-premium rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-3xl">
                {friend.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-semibold">{friend.name}</h4>
                  {friend.isPlaying && (
                    <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                      escuchando
                    </span>
                  )}
                </div>
                {friend.song ? (
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Music2 className="w-4 h-4" />
                    {friend.song.title} - {friend.song.artist}
                  </div>
                ) : (
                  <p className="text-white/40 text-sm">Inactivo</p>
                )}
              </div>
              <span className="text-white/40 text-sm">{friend.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-premium-strong rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Compartir</h3>
            
            {currentSong && (
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5">
                <img src={currentSong.coverUrl} alt={currentSong.title} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="text-white font-semibold">{currentSong.title}</h4>
                  <p className="text-white/60 text-sm">{currentSong.artist}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-xl bg-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2]/30 transition-all font-medium">
                Facebook
              </button>
              <button className="p-4 rounded-xl bg-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/30 transition-all font-medium">
                Twitter
              </button>
              <button className="p-4 rounded-xl bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 transition-all font-medium">
                WhatsApp
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  setShowShareModal(false)
                }}
                className="p-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-medium"
              >
                Copiar Link
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
