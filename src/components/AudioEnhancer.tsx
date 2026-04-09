import { useState, useEffect, useRef } from 'react'
import { Sliders, Power, Music, Volume2, Activity, Sparkles, RotateCcw, Save, Zap } from 'lucide-react'

interface AudioEffect {
  id: string
  name: string
  value: number
  min: number
  max: number
  defaultValue: number
  unit: string
}

interface Preset {
  id: string
  name: string
  description: string
  effects: Record<string, number>
  icon: React.ElementType
  color: string
}

const DEFAULT_EFFECTS: AudioEffect[] = [
  { id: 'bass', name: 'Bass Boost', value: 0, min: -10, max: 10, defaultValue: 0, unit: 'dB' },
  { id: 'treble', name: 'Treble', value: 0, min: -10, max: 10, defaultValue: 0, unit: 'dB' },
  { id: 'reverb', name: 'Reverb', value: 0, min: 0, max: 100, defaultValue: 0, unit: '%' },
  { id: 'echo', name: 'Echo', value: 0, min: 0, max: 100, defaultValue: 0, unit: '%' },
  { id: 'compressor', name: 'Compressor', value: 0, min: 0, max: 100, defaultValue: 0, unit: '%' },
  { id: 'stereo', name: 'Stereo Widening', value: 50, min: 0, max: 100, defaultValue: 50, unit: '%' },
  { id: 'virtualizer', name: '3D Virtualizer', value: 0, min: 0, max: 100, defaultValue: 0, unit: '%' },
  { id: 'loudness', name: 'Loudness', value: 0, min: 0, max: 100, defaultValue: 0, unit: '%' },
]

const PRESETS: Preset[] = [
  {
    id: 'flat',
    name: 'Plano',
    description: 'Sin efectos adicionales',
    effects: { bass: 0, treble: 0, reverb: 0, echo: 0, compressor: 0, stereo: 50, virtualizer: 0, loudness: 0 },
    icon: Activity,
    color: 'from-gray-400 to-gray-500'
  },
  {
    id: 'bass',
    name: 'Bass Boost',
    description: 'Potencia los graves',
    effects: { bass: 8, treble: 0, reverb: 0, echo: 0, compressor: 20, stereo: 60, virtualizer: 30, loudness: 10 },
    icon: Volume2,
    color: 'from-red-400 to-orange-500'
  },
  {
    id: 'vocal',
    name: 'Vocal Clarity',
    description: 'Mejora las voces',
    effects: { bass: -2, treble: 6, reverb: 10, echo: 0, compressor: 30, stereo: 40, virtualizer: 0, loudness: 5 },
    icon: Music,
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'concert',
    name: 'Concert Hall',
    description: 'Efecto de sala de conciertos',
    effects: { bass: 2, treble: 2, reverb: 60, echo: 20, compressor: 40, stereo: 80, virtualizer: 50, loudness: 20 },
    icon: Sparkles,
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 'party',
    name: 'Party Mode',
    description: 'Máximo impacto sonoro',
    effects: { bass: 10, treble: 4, reverb: 30, echo: 15, compressor: 60, stereo: 90, virtualizer: 70, loudness: 40 },
    icon: Zap,
    color: 'from-yellow-400 to-orange-500'
  },
]

export default function AudioEnhancer() {
  const [effects, setEffects] = useState<AudioEffect[]>(DEFAULT_EFFECTS)
  const [isEnabled, setIsEnabled] = useState(true)
  const [selectedPreset, setSelectedPreset] = useState<string>('flat')
  const [analyzerData, setAnalyzerData] = useState<number[]>(new Array(32).fill(0))
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // Simulate audio visualization
  useEffect(() => {
    if (!isEnabled) return

    const animate = () => {
      setAnalyzerData(prev => 
        prev.map(() => Math.random() * 100 * (isEnabled ? 1 : 0.2))
      )
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isEnabled])

  // Draw visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    const barWidth = width / analyzerData.length
    const gap = 2

    analyzerData.forEach((value, index) => {
      const barHeight = (value / 100) * height
      const x = index * barWidth
      const y = height - barHeight

      const gradient = ctx.createLinearGradient(0, y, 0, height)
      gradient.addColorStop(0, '#fbbf24')
      gradient.addColorStop(1, 'rgba(251, 191, 36, 0.2)')

      ctx.fillStyle = gradient
      ctx.fillRect(x + gap / 2, y, barWidth - gap, barHeight)
    })
  }, [analyzerData])

  const handleEffectChange = (id: string, value: number) => {
    setEffects(prev => prev.map(e => 
      e.id === id ? { ...e, value } : e
    ))
    setSelectedPreset('custom')
  }

  const applyPreset = (preset: Preset) => {
    setEffects(prev => prev.map(effect => ({
      ...effect,
      value: preset.effects[effect.id] ?? effect.defaultValue
    })))
    setSelectedPreset(preset.id)
  }

  const resetAll = () => {
    setEffects(DEFAULT_EFFECTS)
    setSelectedPreset('flat')
  }

  const saveCustomPreset = () => {
    const customEffects: Record<string, number> = {}
    effects.forEach(e => {
      customEffects[e.id] = e.value
    })
    
    localStorage.setItem('customAudioPreset', JSON.stringify(customEffects))
    alert('Preset guardado')
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
            <Sliders className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Audio Enhancer</h2>
            <p className="text-white/60">Efectos DSP avanzados</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              isEnabled 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-white'
            }`}
          >
            <Power className="w-5 h-5" />
            {isEnabled ? 'Activado' : 'Desactivado'}
          </button>

          <button
            onClick={resetAll}
            className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Visualizer */}
      <div className="glass-premium rounded-3xl p-6 mb-8">
        <canvas
          ref={canvasRef}
          width={800}
          height={150}
          className="w-full h-36 rounded-2xl bg-black/50"
        />
      </div>

      {/* Presets */}
      <h3 className="text-xl font-bold text-white mb-4">Presets</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {PRESETS.map(preset => {
          const Icon = preset.icon
          const isSelected = selectedPreset === preset.id
          
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`glass-premium rounded-2xl p-4 text-left transition-all ${
                isSelected ? 'border-gold-400/50' : 'hover:border-white/20'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${preset.color} flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">{preset.name}</h4>
              <p className="text-white/50 text-xs">{preset.description}</p>
            </button>
          )
        })}
      </div>

      {/* Effects */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Efectos</h3>
        <button
          onClick={saveCustomPreset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 text-sm"
        >
          <Save className="w-4 h-4" />
          Guardar Preset
        </button>
      </div>

      <div className="glass-premium rounded-3xl p-6">
        <div className="space-y-6">
          {effects.map(effect => (
            <div key={effect.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{effect.name}</span>
                  <span className="text-white/50 text-sm">
                    {effect.value > 0 ? '+' : ''}{effect.value} {effect.unit}
                  </span>
                </div>
                <button
                  onClick={() => handleEffectChange(effect.id, effect.defaultValue)}
                  className="text-xs text-white/40 hover:text-white"
                >
                  Reset
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-white/50 text-sm w-8">{effect.min}</span>
                <input
                  type="range"
                  min={effect.min}
                  max={effect.max}
                  value={effect.value}
                  onChange={(e) => handleEffectChange(effect.id, parseInt(e.target.value))}
                  disabled={!isEnabled}
                  className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-gold-500 disabled:opacity-50"
                />
                <span className="text-white/50 text-sm w-8 text-right">{effect.max}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white font-semibold mb-1">Procesamiento de Audio</h4>
            <p className="text-white/60 text-sm">
              Los efectos DSP se aplican en tiempo real usando Web Audio API. 
              Algunos efectos pueden aumentar el consumo de CPU. Usa presets para resultados óptimos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
