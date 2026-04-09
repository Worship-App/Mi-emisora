import { useState, useEffect } from 'react'
import { Download, WifiOff, Trash2, AlertCircle, Music, FileAudio, Wifi, HardDrive } from 'lucide-react'
import type { Song } from '../types'

interface DownloadedSong extends Song {
  downloadedAt: string
  fileSize: number
  quality: 'high' | 'medium' | 'low'
}

interface OfflineModeProps {
  songs: Song[]
  onPlay: (song: Song) => void
}

export default function OfflineMode({ songs, onPlay }: OfflineModeProps) {
  const [downloadedSongs, setDownloadedSongs] = useState<DownloadedSong[]>([])
  const [isOffline, setIsOffline] = useState(false)
  const [storageUsed, setStorageUsed] = useState(0)
  const [storageLimit] = useState(1024) // 1GB en MB
  const [downloadQuality, setDownloadQuality] = useState<'high' | 'medium' | 'low'>('high')
  const [downloading, setDownloading] = useState<string | null>(null)

  // Check online status
  useEffect(() => {
    setIsOffline(!navigator.onLine)
    
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Load downloaded songs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('downloadedSongs')
    if (saved) {
      const parsed = JSON.parse(saved)
      setDownloadedSongs(parsed)
      const totalSize = parsed.reduce((acc: number, song: DownloadedSong) => acc + song.fileSize, 0)
      setStorageUsed(Math.round(totalSize / 1024 / 1024)) // Convert to MB
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('downloadedSongs', JSON.stringify(downloadedSongs))
  }, [downloadedSongs])

  const handleDownload = async (song: Song) => {
    if (downloadedSongs.some(s => s.id === song.id)) return
    
    setDownloading(song.id)
    
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const fileSize = 5 + Math.random() * 10 // Simulated file size in MB
    
    const downloaded: DownloadedSong = {
      ...song,
      downloadedAt: new Date().toISOString(),
      fileSize: fileSize * 1024 * 1024, // Convert to bytes
      quality: downloadQuality
    }
    
    setDownloadedSongs(prev => [...prev, downloaded])
    setStorageUsed(prev => prev + Math.round(fileSize))
    setDownloading(null)
  }

  const handleDelete = (songId: string) => {
    const song = downloadedSongs.find(s => s.id === songId)
    if (song) {
      setStorageUsed(prev => prev - Math.round(song.fileSize / 1024 / 1024))
      setDownloadedSongs(prev => prev.filter(s => s.id !== songId))
    }
  }

  const handleDeleteAll = () => {
    if (confirm('¿Eliminar todas las canciones descargadas?')) {
      setDownloadedSongs([])
      setStorageUsed(0)
    }
  }

  const availableSongs = songs.filter(s => !downloadedSongs.some(d => d.id === s.id))

  const formatFileSize = (bytes: number) => {
    const mb = bytes / 1024 / 1024
    if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`
    return `${mb.toFixed(1)} MB`
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            {isOffline ? <WifiOff className="w-6 h-6 text-white" /> : <Wifi className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Modo Offline</h2>
            <p className="text-white/60">
              {isOffline ? 'Estás en modo sin conexión' : 'Descarga música para escuchar sin internet'}
            </p>
          </div>
        </div>

        {isOffline && (
          <div className="px-4 py-2 rounded-xl bg-orange-500/20 text-orange-400 text-sm font-medium">
            Sin conexión
          </div>
        )}
      </div>

      {/* Storage Status */}
      <div className="glass-premium rounded-3xl p-8 mb-8 border-glow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <HardDrive className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Almacenamiento</h3>
              <p className="text-white/60">{storageUsed} MB / {storageLimit} MB usados</p>
            </div>
          </div>
          <button
            onClick={handleDeleteAll}
            disabled={downloadedSongs.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar todo
          </button>
        </div>

        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
            style={{ width: `${(storageUsed / storageLimit) * 100}%` }}
          ></div>
        </div>
        <p className="text-white/50 text-sm mt-2">
          {Math.round((storageUsed / storageLimit) * 100)}% utilizado • {downloadedSongs.length} canciones
        </p>
      </div>

      {/* Quality Selector */}
      <div className="glass-premium rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Calidad de Descarga</h3>
        <div className="flex gap-3">
          {(['high', 'medium', 'low'] as const).map(quality => (
            <button
              key={quality}
              onClick={() => setDownloadQuality(quality)}
              className={`flex-1 py-3 rounded-xl transition-all ${
                downloadQuality === quality
                  ? 'bg-gold-500 text-black font-semibold'
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              {quality === 'high' ? 'Alta (320kbps)' : quality === 'medium' ? 'Media (192kbps)' : 'Baja (128kbps)'}
            </button>
          ))}
        </div>
      </div>

      {/* Downloaded Songs */}
      <h3 className="text-2xl font-bold text-white mb-6">
        Canciones Descargadas ({downloadedSongs.length})
      </h3>
      
      {downloadedSongs.length > 0 ? (
        <div className="space-y-3 mb-8">
          {downloadedSongs.map(song => (
            <div key={song.id} className="glass-premium rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <img 
                  src={song.coverUrl} 
                  alt={song.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold truncate">{song.title}</h4>
                  <p className="text-white/60 text-sm">{song.artist}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <FileAudio className="w-3 h-3" />
                      {formatFileSize(song.fileSize)}
                    </span>
                    <span className="capitalize">{song.quality} quality</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPlay(song)}
                    className="p-2 rounded-lg bg-gold-500 text-black hover:bg-gold-400"
                  >
                    <Music className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(song.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-premium rounded-2xl p-12 text-center mb-8">
          <WifiOff className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-xl text-white font-semibold mb-2">No hay canciones descargadas</p>
          <p className="text-white/60">Descarga canciones para escucharlas sin internet</p>
        </div>
      )}

      {/* Available for Download */}
      {!isOffline && availableSongs.length > 0 && (
        <>
          <h3 className="text-2xl font-bold text-white mb-6">
            Disponibles para Descargar
          </h3>
          <div className="space-y-3">
            {availableSongs.slice(0, 10).map(song => {
              const isDownloading = downloading === song.id
              
              return (
                <div key={song.id} className="glass-premium rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={song.coverUrl} 
                      alt={song.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold truncate">{song.title}</h4>
                      <p className="text-white/60 text-sm">{song.artist}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(song)}
                      disabled={isDownloading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        isDownloading
                          ? 'bg-white/10 text-white'
                          : 'bg-gold-500 text-black hover:bg-gold-400'
                      }`}
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Descargando...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Descargar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Info */}
      <div className="mt-8 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white font-semibold mb-1">Modo Offline</h4>
            <p className="text-white/60 text-sm">
              Las canciones descargadas solo están disponibles en este dispositivo. 
              Asegúrate de tener suficiente espacio de almacenamiento antes de descargar.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
