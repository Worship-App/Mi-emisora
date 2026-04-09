import { BarChart3, Clock, Music2, TrendingUp, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Song } from '../types'

interface StatisticsProps {
  stats: {
    totalListeningTime: number
    songsPlayed: number
    mostPlayedSongs: { song: Song; count: number }[]
    dailyStats: Record<string, number>
  }
}

export default function Statistics({ stats }: StatisticsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${mins}m`
  }

  const today = new Date().toISOString().split('T')[0]
  const todayListening = stats.dailyStats[today] || 0

  // Get last 7 days for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const maxValue = Math.max(...last7Days.map(d => stats.dailyStats[d] || 0), 1)

  if (!mounted) return null

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-gold-400" />
          Estadísticas
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Time */}
        <div className="glass-premium rounded-2xl p-6 border-glow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-gold-400" />
            </div>
            <p className="text-white/60 text-sm">Tiempo Total</p>
          </div>
          <p className="text-3xl font-bold text-white">{formatTime(stats.totalListeningTime)}</p>
        </div>

        {/* Songs Played */}
        <div className="glass-premium rounded-2xl p-6 border-glow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-neon-pink/20 flex items-center justify-center">
              <Music2 className="w-6 h-6 text-neon-pink" />
            </div>
            <p className="text-white/60 text-sm">Canciones Reproducidas</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats.songsPlayed.toLocaleString()}</p>
        </div>

        {/* Today */}
        <div className="glass-premium rounded-2xl p-6 border-glow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-neon-cyan" />
            </div>
            <p className="text-white/60 text-sm">Hoy</p>
          </div>
          <p className="text-3xl font-bold text-white">{formatTime(todayListening)}</p>
        </div>

        {/* Average */}
        <div className="glass-premium rounded-2xl p-6 border-glow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-neon-green" />
            </div>
            <p className="text-white/60 text-sm">Promedio Diario</p>
          </div>
          <p className="text-3xl font-bold text-white">
            {formatTime(Math.floor(stats.totalListeningTime / 7))}
          </p>
        </div>
      </div>

      {/* 7 Days Chart */}
      <div className="glass-premium rounded-2xl p-6 border-glow">
        <h3 className="text-xl font-bold text-white mb-6">Últimos 7 días</h3>
        <div className="flex items-end justify-between h-40 gap-2">
          {last7Days.map((date) => {
            const value = stats.dailyStats[date] || 0
            const height = value > 0 ? (value / maxValue) * 100 : 5
            const dayName = new Date(date).toLocaleDateString('es', { weekday: 'short' })
            
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-gold-500/50 to-gold-400 transition-all duration-500"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  />
                  {value > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white/70 whitespace-nowrap">
                      {Math.floor(value / 60)}m
                    </div>
                  )}
                </div>
                <span className="text-xs text-white/50 capitalize">{dayName}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Most Played Songs */}
      <div className="glass-premium rounded-2xl p-6 border-glow">
        <h3 className="text-xl font-bold text-white mb-6">Canciones Más Reproducidas</h3>
        {stats.mostPlayedSongs.length === 0 ? (
          <p className="text-white/50 text-center py-8">Aún no hay datos de reproducción</p>
        ) : (
          <div className="space-y-3">
            {stats.mostPlayedSongs.slice(0, 10).map((item, idx) => (
              <div 
                key={item.song.id} 
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold text-sm">
                  {idx + 1}
                </span>
                <img 
                  src={item.song.coverUrl} 
                  alt={item.song.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{item.song.title}</p>
                  <p className="text-sm text-white/50">{item.song.artist}</p>
                </div>
                <div className="text-right">
                  <p className="text-gold-400 font-bold">{item.count}</p>
                  <p className="text-xs text-white/50">reproducciones</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
