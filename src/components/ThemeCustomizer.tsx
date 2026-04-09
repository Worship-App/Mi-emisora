import { Palette, Check } from 'lucide-react'
import { useState } from 'react'

interface ThemeCustomizerProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
}

const themes = [
  { 
    id: 'premium', 
    name: 'Premium', 
    colors: ['#FFD700', '#000000', '#00FF88'],
    desc: 'Dorado elegante con acentos neón'
  },
  { 
    id: 'neon', 
    name: 'Neón Cyber', 
    colors: ['#FF00FF', '#00FFFF', '#FFFF00'],
    desc: 'Colores brillantes estilo cyberpunk'
  },
  { 
    id: 'ocean', 
    name: 'Océano', 
    colors: ['#0077B6', '#00B4D8', '#90E0EF'],
    desc: 'Tonos azules relajantes'
  },
  { 
    id: 'sunset', 
    name: 'Atardecer', 
    colors: ['#FF6B35', '#F7931E', '#F25F5C'],
    desc: 'Cálidos tonos naranja y rosa'
  },
  { 
    id: 'forest', 
    name: 'Bosque', 
    colors: ['#2D6A4F', '#40916C', '#52B788'],
    desc: 'Verdes naturales y orgánicos'
  },
  { 
    id: 'midnight', 
    name: 'Medianoche', 
    colors: ['#1A1A2E', '#16213E', '#0F3460'],
    desc: 'Azules oscuros profundos'
  }
]

export default function ThemeCustomizer({ currentTheme, onThemeChange }: ThemeCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full glass-premium text-gold-400 hover:text-gold-300 hover:border-gold-400/50 transition-all border border-transparent"
        title="Personalizar tema"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 glass-premium-strong rounded-2xl p-4 z-50 border border-gold-500/20 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-gold-400" />
              Personalizar Tema
            </h3>
            
            <div className="space-y-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    currentTheme === theme.id
                      ? 'bg-gold-500/20 border border-gold-500/40'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex -space-x-1">
                    {theme.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full border-2 border-black/50"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="text-left flex-1">
                    <p className={`font-medium ${currentTheme === theme.id ? 'text-gold-400' : 'text-white'}`}>
                      {theme.name}
                    </p>
                    <p className="text-xs text-white/50">{theme.desc}</p>
                  </div>
                  {currentTheme === theme.id && (
                    <Check className="w-5 h-5 text-gold-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
