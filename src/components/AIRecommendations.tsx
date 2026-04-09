import { useState, useEffect, useMemo } from 'react'
import { Sparkles, TrendingUp, Music, Clock, RefreshCw, ThumbsUp, ThumbsDown, Brain } from 'lucide-react'
import type { Song } from '../types'

interface AIRecommendationsProps {
  songs: Song[]
  history: Song[]
  favorites: Song[]
  currentSong: Song | null
  onPlay: (song: Song) => void
  onAddToQueue: (song: Song) => void
}

interface RecommendationScore {
  song: Song
  score: number
  reasons: string[]
}

export default function AIRecommendations({ 
  songs, 
  history, 
  favorites,
  currentSong,
  onPlay,
  onAddToQueue 
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([])
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'similar' | 'discover' | 'trending'>('all')
  const [feedback, setFeedback] = useState<Record<string, 'like' | 'dislike'>>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // AI Algorithm to calculate recommendations
  const calculateRecommendations = useMemo(() => {
    const scores: RecommendationScore[] = []
    
    // Get unique songs not in history
    const candidateSongs = songs.filter(s => 
      !history.some(h => h.id === s.id) || 
      history.findIndex(h => h.id === s.id) > history.length - 5
    )

    candidateSongs.forEach(song => {
      let score = 0
      const reasons: string[] = []

      // Factor 1: Genre matching from favorites
      const favoriteGenres = new Set(favorites.map(f => f.genre))
      if (favoriteGenres.has(song.genre)) {
        score += 30
        reasons.push(`Género favorito: ${song.genre}`)
      }

      // Factor 2: Artist matching from favorites
      const favoriteArtists = new Set(favorites.map(f => f.artist))
      if (favoriteArtists.has(song.artist)) {
        score += 40
        reasons.push(`Artista favorito: ${song.artist}`)
      }

      // Factor 3: Similar songs in history
      const historyGenres = new Set(history.slice(0, 10).map(h => h.genre))
      if (historyGenres.has(song.genre)) {
        score += 20
        reasons.push('Escuchado recientemente')
      }

      // Factor 4: Year similarity
      if (currentSong) {
        const yearDiff = Math.abs(song.year - currentSong.year)
        if (yearDiff <= 3) {
          score += 15
          reasons.push('Misma época')
        }
      }

      // Factor 5: Popularity based on play count (simulated)
      const playCount = Math.floor(Math.random() * 1000) + 100
      score += Math.min(playCount / 100, 10)

      // Factor 6: User feedback
      if (feedback[song.id] === 'like') {
        score += 50
        reasons.push('Te gustó anteriormente')
      } else if (feedback[song.id] === 'dislike') {
        score -= 100
      }

      if (score > 0) {
        scores.push({ song, score, reasons })
      }
    })

    return scores.sort((a, b) => b.score - a.score).slice(0, 20)
  }, [songs, history, favorites, currentSong, feedback])

  useEffect(() => {
    setIsAnalyzing(true)
    const timer = setTimeout(() => {
      setRecommendations(calculateRecommendations)
      setIsAnalyzing(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [calculateRecommendations])

  const filteredRecommendations = useMemo(() => {
    switch (selectedCategory) {
      case 'similar':
        return recommendations.filter(r => 
          r.reasons.some(reason => reason.includes('Artista') || reason.includes('Género'))
        )
      case 'discover':
        return recommendations.filter(r => 
          r.reasons.some(reason => reason.includes('Escuchado recientemente') || reason.includes('época'))
        )
      case 'trending':
        return recommendations.slice(0, 10)
      default:
        return recommendations
    }
  }, [recommendations, selectedCategory])

  const handleFeedback = (songId: string, type: 'like' | 'dislike') => {
    setFeedback(prev => ({ ...prev, [songId]: type }))
  }

  const refreshRecommendations = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setRecommendations(calculateRecommendations)
      setIsAnalyzing(false)
    }, 800)
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Recomendaciones AI</h2>
            <p className="text-white/60">Powered by machine learning</p>
          </div>
        </div>
        
        <button
          onClick={refreshRecommendations}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span className="text-white">Actualizar</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'Todas', icon: Sparkles },
          { id: 'similar', label: 'Similares', icon: Music },
          { id: 'discover', label: 'Descubrir', icon: TrendingUp },
          { id: 'trending', label: 'Tendencias', icon: Clock }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedCategory(id as typeof selectedCategory)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
              selectedCategory === id
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="glass-premium rounded-2xl p-12 text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-gold-500 animate-pulse flex items-center justify-center">
            <Brain className="w-8 h-8 text-white animate-bounce" />
          </div>
          <p className="text-xl text-white font-semibold mb-2">Analizando tus gustos...</p>
          <p className="text-white/60">Procesando {history.length} canciones escuchadas</p>
        </div>
      )}

      {/* Recommendations Grid */}
      {!isAnalyzing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRecommendations.map(({ song, score, reasons }) => (
            <div
              key={song.id}
              className="glass-premium rounded-2xl p-4 border-glow hover:border-gold-400/30 transition-all group"
            >
              {/* Song Info */}
              <div className="flex items-start gap-3 mb-4">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold truncate">{song.title}</h4>
                  <p className="text-white/60 text-sm truncate">{song.artist}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-gold-400" />
                    <span className="text-xs text-gold-400 font-medium">{Math.round(score)}% match</span>
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div className="flex flex-wrap gap-1 mb-4">
                {reasons.slice(0, 2).map((reason, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/70"
                  >
                    {reason}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPlay(song)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-black font-semibold hover:shadow-lg hover:shadow-gold-500/25 transition-all"
                >
                  Reproducir
                </button>
                <button
                  onClick={() => onAddToQueue(song)}
                  className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <TrendingUp className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleFeedback(song.id, 'like')}
                  className={`p-2.5 rounded-xl transition-all ${
                    feedback[song.id] === 'like' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleFeedback(song.id, 'dislike')}
                  className={`p-2.5 rounded-xl transition-all ${
                    feedback[song.id] === 'dislike' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isAnalyzing && filteredRecommendations.length === 0 && (
        <div className="glass-premium rounded-2xl p-12 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-xl text-white font-semibold mb-2">Necesito más datos</p>
          <p className="text-white/60 max-w-md mx-auto">
            Escucha más canciones para que la IA pueda generar mejores recomendaciones personalizadas.
          </p>
        </div>
      )}
    </section>
  )
}
