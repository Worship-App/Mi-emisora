import { useState, useEffect } from 'react'
import { Cloud, Check, RefreshCw, Download, Upload, Trash2, AlertCircle, Smartphone, Laptop, Tablet } from 'lucide-react'

interface Device {
  id: string
  name: string
  type: 'mobile' | 'desktop' | 'tablet'
  lastSync: string
  isOnline: boolean
}

interface SyncData {
  playlists: number
  favorites: number
  history: number
  settings: boolean
  lastBackup: string
}

export default function CloudSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [syncData, setSyncData] = useState<SyncData>({
    playlists: 12,
    favorites: 45,
    history: 156,
    settings: true,
    lastBackup: new Date().toISOString()
  })
  const [storageUsed] = useState(45) // MB
  const [storageLimit] = useState(100) // MB

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('cloudSyncData')
    if (saved) {
      const data = JSON.parse(saved)
      setLastSync(data.lastSync)
      setDevices(data.devices || [])
    } else {
      // Default devices
      setDevices([
        { id: '1', name: 'Mi Teléfono', type: 'mobile', lastSync: new Date().toISOString(), isOnline: true },
        { id: '2', name: 'Mi Laptop', type: 'desktop', lastSync: new Date(Date.now() - 86400000).toISOString(), isOnline: false },
      ])
    }
  }, [])

  const handleSync = async () => {
    setIsSyncing(true)
    
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const now = new Date().toISOString()
    setLastSync(now)
    localStorage.setItem('cloudSyncData', JSON.stringify({
      lastSync: now,
      devices,
      data: syncData
    }))
    
    setIsSyncing(false)
  }

  const handleBackup = () => {
    const backup = {
      playlists: syncData.playlists,
      favorites: syncData.favorites,
      history: syncData.history,
      settings: syncData.settings,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mi-emisora-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRestore = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string)
            setSyncData(prev => ({
              ...prev,
              playlists: data.playlists || 0,
              favorites: data.favorites || 0,
              history: data.history || 0,
              settings: data.settings || false,
              lastBackup: data.timestamp || new Date().toISOString()
            }))
            alert('Backup restaurado exitosamente')
          } catch {
            alert('Error al restaurar el backup')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const removeDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId))
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return Smartphone
      case 'tablet': return Tablet
      default: return Laptop
    }
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleString('es', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Cloud className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Sincronización Cloud</h2>
          <p className="text-white/60">Tus datos en todos tus dispositivos</p>
        </div>
      </div>

      {/* Sync Status */}
      <div className="glass-premium rounded-3xl p-8 mb-8 border-glow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
              isSyncing ? 'bg-blue-500/20' : 'bg-green-500/20'
            }`}>
              {isSyncing ? (
                <RefreshCw className="w-10 h-10 text-blue-400 animate-spin" />
              ) : (
                <Cloud className="w-10 h-10 text-green-400" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {isSyncing ? 'Sincronizando...' : 'Sincronizado'}
              </h3>
              <p className="text-white/60">
                {lastSync 
                  ? `Última sincronización: ${formatDate(lastSync)}`
                  : 'Aún no has sincronizado'
                }
              </p>
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-premium rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Cloud className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{syncData.playlists}</p>
          <p className="text-white/60 text-sm">Playlists</p>
        </div>

        <div className="glass-premium rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Check className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white">{syncData.favorites}</p>
          <p className="text-white/60 text-sm">Favoritos</p>
        </div>

        <div className="glass-premium rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{syncData.history}</p>
          <p className="text-white/60 text-sm">En historial</p>
        </div>

        <div className="glass-premium rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Check className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">{storageUsed}</p>
          <p className="text-white/60 text-sm">MB usados</p>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="glass-premium rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Almacenamiento Cloud</h3>
          <span className="text-white/60">{storageUsed} MB / {storageLimit} MB</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
            style={{ width: `${(storageUsed / storageLimit) * 100}%` }}
          ></div>
        </div>
        <p className="text-white/50 text-sm mt-2">
          {Math.round((storageUsed / storageLimit) * 100)}% utilizado
        </p>
      </div>

      {/* Connected Devices */}
      <h3 className="text-2xl font-bold text-white mb-6">Dispositivos Conectados</h3>
      <div className="space-y-4 mb-8">
        {devices.map(device => {
          const DeviceIcon = getDeviceIcon(device.type)
          return (
            <div key={device.id} className="glass-premium rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  device.isOnline ? 'bg-green-500/20' : 'bg-white/5'
                }`}>
                  <DeviceIcon className={`w-6 h-6 ${device.isOnline ? 'text-green-400' : 'text-white/50'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-semibold">{device.name}</h4>
                    {device.isOnline ? (
                      <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                        En línea
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-xs">
                        Desconectado
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm">
                    Última sync: {formatDate(device.lastSync)}
                  </p>
                </div>
                <button
                  onClick={() => removeDevice(device.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Backup & Restore */}
      <h3 className="text-2xl font-bold text-white mb-6">Backup y Restauración</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleBackup}
          className="glass-premium rounded-2xl p-6 text-left hover:border-gold-400/30 transition-all"
        >
          <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
            <Download className="w-7 h-7 text-blue-400" />
          </div>
          <h4 className="text-lg font-bold text-white mb-1">Crear Backup</h4>
          <p className="text-white/60 text-sm">Descarga tus datos como archivo JSON</p>
        </button>

        <button
          onClick={handleRestore}
          className="glass-premium rounded-2xl p-6 text-left hover:border-gold-400/30 transition-all"
        >
          <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
            <Upload className="w-7 h-7 text-green-400" />
          </div>
          <h4 className="text-lg font-bold text-white mb-1">Restaurar Backup</h4>
          <p className="text-white/60 text-sm">Carga datos desde un archivo de backup</p>
        </button>
      </div>

      {/* Info */}
      <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white font-semibold mb-1">Sincronización automática</h4>
            <p className="text-white/60 text-sm">
              Tus datos se sincronizan automáticamente cada vez que haces cambios. 
              Asegúrate de tener conexión a internet para mantener todos tus dispositivos actualizados.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
