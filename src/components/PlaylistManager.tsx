import { Download, Upload, FileJson, Check, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import type { Playlist, Song } from '../types'

interface PlaylistManagerProps {
  playlists: Playlist[]
  onImportPlaylists: (playlists: Playlist[]) => void
  songs: Song[]
}

export default function PlaylistManager({ playlists, onImportPlaylists, songs }: PlaylistManagerProps) {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [exportStatus, setExportStatus] = useState<'idle' | 'success'>('idle')
  const [message, setMessage] = useState('')

  const exportPlaylists = () => {
    if (playlists.length === 0) {
      setImportStatus('error')
      setMessage('No hay playlists para exportar')
      setTimeout(() => setImportStatus('idle'), 3000)
      return
    }

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      playlists: playlists
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mi-emisora-playlists-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setExportStatus('success')
    setMessage(`${playlists.length} playlist(s) exportada(s)`)
    setTimeout(() => setExportStatus('idle'), 3000)
  }

  const importPlaylists = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        // Validate structure
        if (!data.playlists || !Array.isArray(data.playlists)) {
          throw new Error('Formato inválido: no se encontraron playlists')
        }

        // Validate each playlist
        const validPlaylists = data.playlists.filter((p: any) => {
          return p.id && p.name && p.songs && Array.isArray(p.songs)
        })

        if (validPlaylists.length === 0) {
          throw new Error('No se encontraron playlists válidas')
        }

        // Validate songs exist in our library
        const validatedPlaylists = validPlaylists.map((playlist: Playlist) => ({
          ...playlist,
          songs: playlist.songs.filter((song: Song) => 
            songs.some(s => s.id === song.id)
          )
        }))

        onImportPlaylists(validatedPlaylists)
        setImportStatus('success')
        setMessage(`${validatedPlaylists.length} playlist(s) importada(s)`)
      } catch (error) {
        setImportStatus('error')
        setMessage(error instanceof Error ? error.message : 'Error al importar')
      }

      // Reset input
      event.target.value = ''
      setTimeout(() => setImportStatus('idle'), 3000)
    }

    reader.onerror = () => {
      setImportStatus('error')
      setMessage('Error al leer el archivo')
      setTimeout(() => setImportStatus('idle'), 3000)
    }

    reader.readAsText(file)
  }

  const exportStats = () => {
    const stats = localStorage.getItem('stats')
    const favorites = localStorage.getItem('favorites')
    const history = localStorage.getItem('history')
    
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        stats: stats ? JSON.parse(stats) : null,
        favorites: favorites ? JSON.parse(favorites) : [],
        history: history ? JSON.parse(history) : [],
        playlists: playlists
      }
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mi-emisora-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setExportStatus('success')
    setMessage('Backup completo exportado')
    setTimeout(() => setExportStatus('idle'), 3000)
  }

  return (
    <div className="glass-premium rounded-2xl p-6 space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <FileJson className="w-5 h-5 text-gold-400" />
        Gestión de Playlists
      </h3>

      {/* Status Message */}
      {importStatus !== 'idle' && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          importStatus === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {importStatus === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message}</span>
        </div>
      )}

      {exportStatus === 'success' && (
        <div className="p-4 rounded-xl flex items-center gap-3 bg-green-500/20 text-green-400">
          <Check className="w-5 h-5" />
          <span>{message}</span>
        </div>
      )}

      {/* Export Section */}
      <div className="space-y-3">
        <p className="text-sm text-white/60">Exportar datos</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportPlaylists}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar playlists</span>
          </button>
          <button
            onClick={exportStats}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Backup completo</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="space-y-3">
        <p className="text-sm text-white/60">Importar datos</p>
        <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer w-fit">
          <Upload className="w-4 h-4" />
          <span>Importar playlists</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={importPlaylists}
            className="hidden"
          />
        </label>
        <p className="text-xs text-white/40">
          Soporta archivos JSON exportados previamente desde Mi Emisora
        </p>
      </div>

      {/* Info */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-sm text-white/50">
          Tienes <span className="text-gold-400 font-bold">{playlists.length}</span> playlist(s) guardada(s)
        </p>
      </div>
    </div>
  )
}
