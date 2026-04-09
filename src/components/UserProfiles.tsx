import { useState, useEffect } from 'react'
import { User, Edit2, Trash2, Check, Crown, Music, Clock, Heart, UserPlus } from 'lucide-react'

interface Profile {
  id: string
  name: string
  avatar: string
  color: string
  createdAt: string
  preferences: {
    genres: string[]
    theme: string
    autoPlay: boolean
    crossfade: boolean
    language: string
  }
  stats: {
    totalListeningTime: number
    songsPlayed: number
    favoritesCount: number
  }
}

interface UserProfilesProps {
  currentProfile: Profile | null
  onProfileChange: (profile: Profile) => void
  onCreateProfile: (name: string, color: string) => void
  onDeleteProfile: (id: string) => void
  onUpdateProfile: (profile: Profile) => void
}

const AVATAR_COLORS = [
  { name: 'Rojo', value: 'from-red-400 to-rose-500' },
  { name: 'Naranja', value: 'from-orange-400 to-amber-500' },
  { name: 'Amarillo', value: 'from-yellow-400 to-amber-400' },
  { name: 'Verde', value: 'from-green-400 to-emerald-500' },
  { name: 'Cyan', value: 'from-cyan-400 to-teal-500' },
  { name: 'Azul', value: 'from-blue-400 to-indigo-500' },
  { name: 'Púrpura', value: 'from-purple-400 to-violet-500' },
  { name: 'Rosa', value: 'from-pink-400 to-rose-500' },
  { name: 'Oro', value: 'from-gold-400 to-yellow-500' }
]

const AVATAR_ICONS = ['👤', '🎵', '🎸', '🎹', '🎺', '🎻', '🥁', '🎧', '🎤', '🌟', '🔥', '💎']

export default function UserProfiles({
  currentProfile,
  onProfileChange,
  onCreateProfile,
  onDeleteProfile,
  onUpdateProfile
}: UserProfilesProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [newProfileName, setNewProfileName] = useState('')
  const [newProfileColor, setNewProfileColor] = useState(AVATAR_COLORS[0].value)
  const [newProfileAvatar, setNewProfileAvatar] = useState(AVATAR_ICONS[0])

  // Load profiles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userProfiles')
    if (saved) {
      setProfiles(JSON.parse(saved))
    } else {
      // Create default profile
      const defaultProfile: Profile = {
        id: 'default',
        name: 'Yo',
        avatar: '👤',
        color: 'from-gold-400 to-yellow-500',
        createdAt: new Date().toISOString(),
        preferences: {
          genres: [],
          theme: 'premium',
          autoPlay: true,
          crossfade: false,
          language: 'es'
        },
        stats: {
          totalListeningTime: 0,
          songsPlayed: 0,
          favoritesCount: 0
        }
      }
      setProfiles([defaultProfile])
      onProfileChange(defaultProfile)
    }
  }, [])

  // Save profiles to localStorage
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('userProfiles', JSON.stringify(profiles))
    }
  }, [profiles])

  const handleCreate = () => {
    if (newProfileName.trim()) {
      const newProfile: Profile = {
        id: Date.now().toString(),
        name: newProfileName.trim(),
        avatar: newProfileAvatar,
        color: newProfileColor,
        createdAt: new Date().toISOString(),
        preferences: {
          genres: [],
          theme: 'premium',
          autoPlay: true,
          crossfade: false,
          language: 'es'
        },
        stats: {
          totalListeningTime: 0,
          songsPlayed: 0,
          favoritesCount: 0
        }
      }
      
      onCreateProfile(newProfileName.trim(), newProfileColor)
      setProfiles(prev => [...prev, newProfile])
      setNewProfileName('')
      setNewProfileColor(AVATAR_COLORS[0].value)
      setNewProfileAvatar(AVATAR_ICONS[0])
      setShowCreateModal(false)
    }
  }

  const handleDelete = (id: string) => {
    if (profiles.length > 1) {
      onDeleteProfile(id)
      setProfiles(prev => {
        const filtered = prev.filter(p => p.id !== id)
        // If current profile deleted, switch to first available
        if (currentProfile?.id === id && filtered.length > 0) {
          onProfileChange(filtered[0])
        }
        return filtered
      })
    }
  }

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile)
    setNewProfileName(profile.name)
    setNewProfileColor(profile.color)
    setNewProfileAvatar(profile.avatar)
    setShowEditModal(true)
  }

  const handleUpdate = () => {
    if (editingProfile && newProfileName.trim()) {
      const updated = {
        ...editingProfile,
        name: newProfileName.trim(),
        color: newProfileColor,
        avatar: newProfileAvatar
      }
      
      onUpdateProfile(updated)
      setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p))
      
      if (currentProfile?.id === updated.id) {
        onProfileChange(updated)
      }
      
      setShowEditModal(false)
      setEditingProfile(null)
      setNewProfileName('')
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Perfiles</h2>
            <p className="text-white/60">Gestiona múltiples usuarios</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Nuevo Perfil
        </button>
      </div>

      {/* Current Profile Card */}
      {currentProfile && (
        <div className="glass-premium rounded-3xl p-8 mb-8 border-glow">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentProfile.color} flex items-center justify-center text-5xl`}>
              {currentProfile.avatar}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-3xl font-bold text-white">{currentProfile.name}</h3>
                {currentProfile.id === profiles[0]?.id && (
                  <Crown className="w-6 h-6 text-gold-400" />
                )}
              </div>
              <p className="text-white/60 mb-4">
                Creado el {new Date(currentProfile.createdAt).toLocaleDateString('es')}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5">
                  <Clock className="w-5 h-5 text-gold-400" />
                  <span className="text-white/70">{formatTime(currentProfile.stats.totalListeningTime)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5">
                  <Music className="w-5 h-5 text-blue-400" />
                  <span className="text-white/70">{currentProfile.stats.songsPlayed} canciones</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="text-white/70">{currentProfile.stats.favoritesCount} favoritos</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(currentProfile)}
                className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Profiles Grid */}
      <h3 className="text-2xl font-bold text-white mb-6">Todos los Perfiles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map(profile => (
          <div
            key={profile.id}
            onClick={() => onProfileChange(profile)}
            className={`glass-premium rounded-2xl p-6 cursor-pointer transition-all hover:border-gold-400/30 ${
              currentProfile?.id === profile.id ? 'border-gold-400/50 bg-gold-500/5' : ''
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-3xl`}>
                {profile.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-bold text-white">{profile.name}</h4>
                  {currentProfile?.id === profile.id && (
                    <Check className="w-5 h-5 text-green-400" />
                  )}
                </div>
                <p className="text-white/60 text-sm">
                  {profile.id === profiles[0]?.id ? 'Administrador' : 'Usuario'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/40 text-sm">
                {profile.stats.songsPlayed} canciones reproducidas
              </span>
              
              {profiles.length > 1 && profile.id !== profiles[0]?.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(profile.id)
                  }}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-premium-strong rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Crear Nuevo Perfil</h3>

            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">Nombre</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Nombre del perfil"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-gold-400 focus:outline-none"
                maxLength={20}
              />
            </div>

            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">Avatar</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewProfileAvatar(icon)}
                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                      newProfileAvatar === icon 
                        ? 'bg-gold-500 text-black' 
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-white/70 text-sm mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_COLORS.map(({ name, value }) => (
                  <button
                    key={value}
                    onClick={() => setNewProfileColor(value)}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${value} transition-all ${
                      newProfileColor === value ? 'ring-2 ring-white scale-110' : ''
                    }`}
                    title={name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!newProfileName.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all disabled:opacity-50"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-premium-strong rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">Editar Perfil</h3>

            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">Nombre</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Nombre del perfil"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-gold-400 focus:outline-none"
                maxLength={20}
              />
            </div>

            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">Avatar</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewProfileAvatar(icon)}
                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                      newProfileAvatar === icon 
                        ? 'bg-gold-500 text-black' 
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-white/70 text-sm mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_COLORS.map(({ name, value }) => (
                  <button
                    key={value}
                    onClick={() => setNewProfileColor(value)}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${value} transition-all ${
                      newProfileColor === value ? 'ring-2 ring-white scale-110' : ''
                    }`}
                    title={name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                disabled={!newProfileName.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
