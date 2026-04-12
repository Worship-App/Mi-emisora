import { Music, Heart, ListMusic, Home, X, History, BarChart3, Sparkles, Zap, Radio, User, Brain, Users, Mic2, Cloud, Download, Sliders, Share2, Disc3 } from 'lucide-react'
import ThemeCustomizer from './ThemeCustomizer'
import { useState, useEffect } from 'react'

interface HeaderProps {
  activeTab: 'all' | 'favorites' | 'playlists' | 'history' | 'stats' | 'recommendations' | 'smart' | 'radio' | 'profiles' | 'mood' | 'collaborative' | 'nowplaying' | 'podcasts' | 'lyrics' | 'cloud' | 'offline' | 'enhancer'
  setActiveTab: (tab: 'all' | 'favorites' | 'playlists' | 'history' | 'stats' | 'recommendations' | 'smart' | 'radio' | 'profiles' | 'mood' | 'collaborative' | 'nowplaying' | 'podcasts' | 'lyrics' | 'cloud' | 'offline' | 'enhancer') => void
  favoritesCount: number
  playlistsCount: number
  historyCount: number
  isDarkMode: boolean
  toggleTheme: () => void
  currentTheme: string
  onThemeChange: (theme: string) => void
}

interface NavSection {
  title: string
  items: Array<{
    id: HeaderProps['activeTab']
    label: string
    icon: React.ElementType
    count: number | null
    description?: string
  }>
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  favoritesCount, 
  playlistsCount,
  historyCount,
  isDarkMode,
  toggleTheme,
  currentTheme,
  onThemeChange
}: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Cerrar sidebar con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Secciones organizadas del menú
  const mainSection: NavSection = {
    title: 'Principal',
    items: [
      { id: 'all', label: 'Inicio', icon: Home, count: null, description: 'Todas las canciones' },
      { id: 'favorites', label: 'Favoritos', icon: Heart, count: favoritesCount, description: 'Tus canciones favoritas' },
      { id: 'playlists', label: 'Listas', icon: ListMusic, count: playlistsCount, description: 'Tus playlists' },
      { id: 'history', label: 'Historial', icon: History, count: historyCount, description: 'Últimas reproducciones' },
    ]
  }

  const aiSection: NavSection = {
    title: 'Inteligente',
    items: [
      { id: 'stats', label: 'Estadísticas', icon: BarChart3, count: null, description: 'Tus estadísticas' },
      { id: 'recommendations', label: 'Para Ti', icon: Sparkles, count: null, description: 'Recomendaciones IA' },
      { id: 'smart', label: 'Smart Playlists', icon: Zap, count: null, description: 'Playlists inteligentes' },
      { id: 'mood', label: 'Ánimo', icon: Brain, count: null, description: 'Detección de estado de ánimo' },
    ]
  }

  const contentSection: NavSection = {
    title: 'Contenido',
    items: [
      { id: 'radio', label: 'Radio FM', icon: Radio, count: null, description: 'Radio en vivo' },
      { id: 'podcasts', label: 'Podcasts', icon: Mic2, count: null, description: 'Episodios y series' },
      { id: 'lyrics', label: 'Letras', icon: Disc3, count: null, description: 'Letras sincronizadas' },
      { id: 'nowplaying', label: 'En Vivo', icon: Share2, count: null, description: 'Compartir actividad' },
    ]
  }

  const toolsSection: NavSection = {
    title: 'Herramientas',
    items: [
      { id: 'collaborative', label: 'Colaborativa', icon: Users, count: null, description: 'Playlists compartidas' },
      { id: 'profiles', label: 'Perfiles', icon: User, count: null, description: 'Gestión de perfiles' },
      { id: 'cloud', label: 'Cloud', icon: Cloud, count: null, description: 'Sincronización en la nube' },
      { id: 'offline', label: 'Offline', icon: Download, count: null, description: 'Música sin conexión' },
      { id: 'enhancer', label: 'Audio DSP', icon: Sliders, count: null, description: 'Mejora de audio' },
    ]
  }

  const allSections = [mainSection, aiSection, contentSection, toolsSection]

  const handleNavClick = (id: HeaderProps['activeTab']) => {
    setActiveTab(id)
    setSidebarOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-40 glass-premium-strong border-b border-gold-500/20 backdrop-blur-xl">
        <div className="w-full px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Botón Menú + Logo */}
            <div className="flex items-center gap-3">
              {/* ☰ Botón Hamburguesa */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 rounded-xl glass-premium text-white/90 hover:text-gold-400 hover:bg-white/10 transition-all duration-300 group"
                title="Abrir menú"
              >
                <div className="flex flex-col gap-1.5 w-5">
                  <span className="block h-0.5 bg-current rounded-full transition-all duration-300 group-hover:w-full w-5"></span>
                  <span className="block h-0.5 bg-current rounded-full transition-all duration-300 group-hover:w-3/4 w-5"></span>
                  <span className="block h-0.5 bg-current rounded-full transition-all duration-300 group-hover:w-full w-5"></span>
                </div>
              </button>

              {/* Logo PREMIUM */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-gold-400 via-yellow-300 to-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/30">
                  <Music className="w-4 h-4 lg:w-5 lg:h-5 text-black" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-base lg:text-lg font-bold text-gold tracking-wide">
                    MI EMISORA
                  </h1>
                  <p className="text-[10px] text-white/50 -mt-0.5">Experiencia Premium</p>
                </div>
              </div>
            </div>

            {/* Indicador de sección activa - PREMIUM */}
            <div className="hidden lg:flex flex-1 justify-center">
              {(() => {
                const currentItem = allSections.flatMap(s => s.items).find(item => item.id === activeTab)
                const currentSection = allSections.find(s => s.items.some(i => i.id === activeTab))
                if (!currentItem) return null
                
                return (
                  <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-white/5 via-white/10 to-white/5 border border-white/10 backdrop-blur-sm">
                    {/* Icono de la sección */}
                    <currentItem.icon className="w-4 h-4 text-gold-400" />
                    
                    {/* Texto con breadcrumb */}
                    <div className="flex items-center gap-2 text-sm">
                      {currentSection && (
                        <>
                          <span className="text-white/40 font-medium">{currentSection.title}</span>
                          <span className="text-white/30">/</span>
                        </>
                      )}
                      <span className="text-white font-semibold">{currentItem.label}</span>
                    </div>
                    
                    {/* Indicador pulsante */}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                    </span>
                  </div>
                )
              })()}
            </div>

            {/* Theme Toggle & Customizer */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Theme Customizer */}
              <div className="hidden sm:block">
                <ThemeCustomizer 
                  currentTheme={currentTheme} 
                  onThemeChange={onThemeChange}
                />
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl glass-premium text-white/70 hover:text-gold-400 hover:bg-white/10 transition-all duration-300"
                title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 🟰 OVERLAY oscuro cuando el menú está abierto */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 📱 SIDEBAR Lateral */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-72 sm:w-80 bg-gradient-to-b from-gray-900 via-gray-900 to-black
          border-r border-gold-500/20 shadow-2xl z-50 transform transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center">
              <Music className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-gold font-bold">MI EMISORA</h2>
              <p className="text-[10px] text-white/50">Menú Principal</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del Menú */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto p-4 space-y-6">
          {allSections.map((section) => (
            <div key={section.title}>
              {/* Título de sección */}
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-2">
                {section.title}
              </h3>
              
              {/* Items de la sección */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-xl
                        transition-all duration-200 group
                        ${isActive 
                          ? 'bg-gradient-to-r from-gold-400/20 to-gold-500/20 text-gold-400 border border-gold-500/30' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      <item.icon className={`
                        w-5 h-5 transition-transform duration-200 group-hover:scale-110
                        ${isActive ? 'text-gold-400' : ''}
                      `} />
                      <span className="flex-1 text-sm font-medium text-left">{item.label}</span>
                      {item.count !== null && item.count > 0 && (
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-bold
                          ${isActive ? 'bg-gold-500/30 text-gold-400' : 'bg-white/10 text-white/60'}
                        `}>
                          {item.count}
                        </span>
                      )}
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400 shadow-glow" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer del Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-gradient-to-t from-black to-transparent">
          <p className="text-[10px] text-white/40 text-center">
            Presiona ESC para cerrar
          </p>
        </div>
      </aside>
    </>
  )
}
