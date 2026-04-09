import { useEffect, useRef } from 'react'

interface VisualizerProps {
  isPlaying: boolean
}

export default function Visualizer({ isPlaying }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const barsRef = useRef<number[]>(Array(64).fill(0))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const animate = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const barWidth = width / 64
      
      ctx.clearRect(0, 0, width, height)

      // Update bars with smooth animation
      barsRef.current = barsRef.current.map((bar, i) => {
        if (isPlaying) {
          // Create wave pattern
          const time = Date.now() / 1000
          const frequency = 2 + (i % 3)
          const amplitude = 0.3 + (i % 5) * 0.1
          const noise = Math.sin(time * frequency + i * 0.2) * amplitude
          const randomNoise = (Math.random() - 0.5) * 0.2
          const targetHeight = Math.max(0.1, 0.4 + noise + randomNoise)
          
          // Smooth transition
          return bar + (targetHeight - bar) * 0.15
        } else {
          // Return to baseline when paused
          return bar + (0.05 - bar) * 0.1
        }
      })

      // Draw bars
      barsRef.current.forEach((barHeight, i) => {
        const x = i * barWidth
        const barH = barHeight * height * 0.8
        const y = (height - barH) / 2

        // Create gradient for each bar - GOLD premium theme
        const gradient = ctx.createLinearGradient(0, y, 0, y + barH)
        
        // Color based on height - Gold to neon green range
        const hue = 45 + (barHeight * 30) // 45 = gold, up to 75 = yellow-green
        const saturation = 90
        const lightness = 50 + barHeight * 20
        
        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 20}%, 0.9)`)
        gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`)
        gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness - 10}%, 0.8)`)

        // Draw bar with rounded top
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(x + 1, y, barWidth - 2, barH, 4)
        ctx.fill()

        // Add glow effect for tall bars
        if (barHeight > 0.6) {
          ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`
          ctx.shadowBlur = 15
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Draw center line
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  return (
    <div className="w-full h-32 md:h-40 glass-premium rounded-2xl overflow-hidden relative border border-gold-500/20">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ imageRendering: 'crisp-edges' }}
      />
      {/* Status indicator */}
      <div className="absolute bottom-3 left-4 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-neon-green animate-pulse' : 'bg-gold-400'} shadow-lg`}></span>
        <span className="text-xs text-gold-400/80 font-semibold tracking-wider uppercase">
          {isPlaying ? 'Reproduciendo' : 'Pausado'}
        </span>
      </div>
      
      {/* Premium badge */}
      <div className="absolute top-3 right-4">
        <span className="text-xs text-white/40 font-medium tracking-widest uppercase">Premium Audio</span>
      </div>
    </div>
  )
}
