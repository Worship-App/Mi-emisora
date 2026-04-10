import { Music, Heart, ListMusic, Home, Menu, X, History, BarChart3, Sparkles, Zap, Radio, User, Brain, Users, Mic2, Cloud, Download, Sliders, Share2, MoreHorizontal, ChevronRight, Disc3 } from 'lucide-react'
import ThemeCustomizer from './ThemeCustomizer'
import { useState, useRef, useEffect } from 'react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  // Cerrar menú "Más" al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
      { id: 'stats', label: 'Stats', icon: BarChart3, count: null, description: 'Tus estadísticas' },
      { id: 'recommendations', label: 'Para Ti', icon: Sparkles, count: null, description: 'Recomendaciones IA' },
      { id: 'smart', label: 'Smart', icon: Zap, count: null, description: 'Playlists inteligentes' },
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

  const moreItems = [
    { id: 'collaborative' as const, label: 'Colaborativa', icon: Users, count: null, description: 'Playlists compartidas' },
    { id: 'profiles' as const, label: 'Perfiles', icon: User, count: null, description: 'Gestión de perfiles' },
    { id: 'cloud' as const, label: 'Cloud', icon: Cloud, count: null, description: 'Sincronización en la nube' },
    { id: 'offline' as const, label: 'Offline', icon: Download, count: null, description: 'Música sin conexión' },
    { id: 'enhancer' as const, label: 'Audio DSP', icon: Sliders, count: null, description: 'Mejora de audio' },
  ]

  const allSections = [mainSection, aiSection, contentSection]

  const renderNavButton = (item: any, isCompact = false) => {
    const isActive = activeTab === item.id
    const isHovered = hoveredItem === item.id

    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        className={`
          relative group flex items-center gap-2 font-medium transition-all duration-300 ease-out
          ${isCompact 
            ? 'px-3 py-2 rounded-lg text-sm' 
            : 'px-4 py-2.5 rounded-xl text-sm xl:text-base'
          }
          ${isActive 
            ? 'bg-gradient-to-r from-gold-400/90 to-gold-500/90 text-black shadow-lg shadow-gold-500/30' 
            : 'text-white/80 hover:text-white hover:bg-white/10'
          }
        `}
      >
        {/* Icono con animación */}
        <item.icon 
          className={`
            transition-transform duration-300 
            ${isCompact ? 'w-4 h-4' : 'w-4 h-4 xl:w-5 xl:h-5'}
            ${isHovered && !isActive ? 'scale-110' : ''}
            ${isActive ? 'text-black' : ''}
          `} 
        />
        
        {/* Label */}
        <span className="whitespace-nowrap">{item.label}</span>
        
        {/* Badge de conteo */}
        {item.count !== null && item.count > 0 && (
          <span className={`
            ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold
            ${isActive ? 'bg-black/20 text-black' : 'bg-gold-500/20 text-gold-400'}
          `}>
            {item.count > 99 ? '99+' : item.count}
          </span>
        )}

        {/* Tooltip */}
        {isHovered && item.description && !isCompact && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {item.description}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
          </div>
        )}

        {/* Indicador activo */}
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold-400 rounded-full shadow-glow"></div>
        )}
      </button>
    )
  }

  return (
    <header className="sticky top-0 z-50 glass-premium-strong border-b border-gold-500/20 backdrop-blur-xl">
      <div className="w-full px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo PREMIUM */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-gold-400 via-yellow-300 to-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/30">
              <Music className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold text-gold tracking-wide">
                MI EMISORA
              </h1>
              <p className="text-[10px] lg:text-xs text-white/50 -mt-0.5">Experiencia Premium</p>
            </div>
          </div>

          {/* Desktop Navigation - Organizado en secciones */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 overflow-x-auto scrollbar-hide max-w-3xl xl:max-w-4xl">
            {allSections.map((section, sectionIndex) => (
              <div key={section.title} className="flex items-center">
                {/* Separador entre secciones */}
                {sectionIndex > 0 && (
                  <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mx-2 xl:mx-3"></div>
                )}
                
                {/* Items de la sección */}
                <div className="flex items-center gap-1">
                  {section.items.map((item) => renderNavButton(item))}
                </div>
              </div>
            ))}

            {/* Botón "Más" con menú desplegable */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`
                  flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-medium text-sm
                  transition-all duration-300
                  ${showMoreMenu 
                    ? 'bg-gold-500/20 text-gold-400' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <MoreHorizontal className="w-5 h-5" />
                <span className="hidden xl:inline">Más</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showMoreMenu ? 'rotate-90' : ''}`} />
              </button>

              {/* Menú desplegable */}
              {showMoreMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50">
                  <div className="text-xs font-medium text-white/40 uppercase tracking-wider px-3 py-2">
                    Herramientas
                  </div>
                  {moreItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setShowMoreMenu(false)
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                        transition-all duration-200 text-left
                        ${activeTab === item.id
                          ? 'bg-gold-500/20 text-gold-400'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      <item.icon className="w-4 h-4" />
                      <div className="flex-1">
                        <div>{item.label}</div>
                        <div className="text-[10px] text-white/40">{item.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Tablet Navigation - Versión compacta */}
          <nav className="hidden md:flex lg:hidden items-center gap-1 overflow-x-auto max-w-md">
            {[...mainSection.items, ...aiSection.items.slice(0, 2)].map((item) => renderNavButton(item, true))}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </nav>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-1.5 lg:gap-2 flex-shrink-0">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl glass-premium text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Panel deslizable */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="grid grid-cols-2 gap-2">
              {[...mainSection.items, ...aiSection.items, ...contentSection.items, ...moreItems].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any)
                    setMobileMenuOpen(false)
                  }}
                  className={`
                    flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl
                    transition-all duration-300
                    ${activeTab === item.id
                      ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-black'
                      : 'bg-white/5 text-white/80 hover:bg-white/10'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {item.count !== null && item.count > 0 && (
                    <span className={`
                      text-[10px] px-1.5 py-0.5 rounded-full font-bold
                      ${activeTab === item.id ? 'bg-black/20' : 'bg-gold-500/20 text-gold-400'}
                    `}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
