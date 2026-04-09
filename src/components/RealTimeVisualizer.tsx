import { useEffect, useRef, useState } from 'react'
import { Activity, Power, Settings2 } from 'lucide-react'

interface RealTimeVisualizerProps {
  audioElement: HTMLAudioElement | null
  isPlaying: boolean
}

export default function RealTimeVisualizer({ audioElement, isPlaying }: RealTimeVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationRef = useRef<number>()
  const [isInitialized, setIsInitialized] = useState(false)
  const [showControls, setShowControls] = useState(false)

  // Initialize Web Audio API
  useEffect(() => {
    if (!audioElement || isInitialized) return

    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      // Create analyser
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser

      // Connect audio element
      const source = audioContext.createMediaElementSource(audioElement)
      source.connect(analyser)
      analyser.connect(audioContext.destination)
      sourceRef.current = source

      setIsInitialized(true)
    } catch (error) {
      console.error('Web Audio API not supported:', error)
    }

    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close()
      }
    }
  }, [audioElement, isInitialized])

  // Handle play/pause state
  useEffect(() => {
    if (!audioContextRef.current) return

    if (isPlaying && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }
  }, [isPlaying])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!ctx || !canvas) return

      analyser.getByteFrequencyData(dataArray)

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set canvas size for high DPI
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)

      const width = rect.width
      const height = rect.height
      const barCount = 64
      const barWidth = width / barCount
      const gap = 2

      // Draw frequency bars
      for (let i = 0; i < barCount; i++) {
        // Map linear index to logarithmic frequency scale
        const index = Math.floor((i / barCount) * (bufferLength / 2))
        const value = dataArray[index] || 0
        
        // Calculate bar height with scaling
        const barHeight = (value / 255) * height * 0.9
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight)
        
        // Color based on frequency (low to high)
        const hue = 40 + (i / barCount) * 60 // Gold to green
        gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.8)`)
        gradient.addColorStop(1, `hsla(${hue + 20}, 100%, 70%, 1)`)
        
        // Draw bar with rounded top
        const x = i * barWidth + gap / 2
        const y = height - barHeight
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth - gap, barHeight, [4, 4, 0, 0])
        ctx.fill()

        // Add glow effect
        if (value > 200) {
          ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.5)`
          ctx.shadowBlur = 20
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }

      // Draw frequency response curve
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)'
      ctx.lineWidth = 2
      
      for (let i = 0; i < barCount; i++) {
        const index = Math.floor((i / barCount) * (bufferLength / 2))
        const value = dataArray[index] || 0
        const barHeight = (value / 255) * height * 0.9
        const x = i * barWidth + barWidth / 2
        const y = height - barHeight
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.stroke()

      animationRef.current = requestAnimationFrame(draw)
    }

    if (isPlaying) {
      draw()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  if (!isInitialized) {
    return (
      <div className="w-full h-24 rounded-2xl glass-premium flex items-center justify-center">
        <p className="text-white/50 text-sm">Inicia la reproducción para activar el visualizador</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Canvas Visualizer */}
      <div className="relative w-full h-32 rounded-2xl overflow-hidden glass-premium-strong">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ imageRendering: 'crisp-edges' }}
        />
        
        {/* Overlay Info */}
        <div className="absolute top-2 left-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-gold-400" />
          <span className="text-xs text-white/60">Web Audio API</span>
        </div>

        {/* Controls Toggle */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="absolute top-2 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Settings2 className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="glass-premium rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Analizador de frecuencia</span>
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400">Activo</span>
            </div>
          </div>
          
          <div className="text-xs text-white/40">
            Analizando audio en tiempo real usando Web Audio API
          </div>
        </div>
      )}
    </div>
  )
}
