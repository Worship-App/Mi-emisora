import { Music, Heart, ListMusic, Home, Menu, X, History, BarChart3, Sparkles, Zap, Radio, User, Brain, Users, Mic2, Cloud, Download, Sliders, Share2 } from 'lucide-react'
import ThemeCustomizer from './ThemeCustomizer'
import { useState } from 'react'

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

  const navItems = [
    { id: 'all', label: 'Inicio', icon: Home, count: null },
    { id: 'favorites', label: 'Favoritos', icon: Heart, count: favoritesCount },
    { id: 'playlists', label: 'Listas', icon: ListMusic, count: playlistsCount },
    { id: 'history', label: 'Historial', icon: History, count: historyCount },
    { id: 'stats', label: 'Stats', icon: BarChart3, count: null },
    { id: 'recommendations', label: 'Para Ti', icon: Sparkles, count: null },
    { id: 'smart', label: 'Smart', icon: Zap, count: null },
    { id: 'mood', label: 'Ánimo', icon: Brain, count: null },
    { id: 'radio', label: 'Radio', icon: Radio, count: null },
    { id: 'podcasts', label: 'Podcasts', icon: Mic2, count: null },
    { id: 'lyrics', label: 'Letras', icon: Mic2, count: null },
    { id: 'nowplaying', label: 'En Vivo', icon: Share2, count: null },
    { id: 'collaborative', label: 'Colab', icon: Users, count: null },
    { id: 'cloud', label: 'Cloud', icon: Cloud, count: null },
    { id: 'offline', label: 'Offline', icon: Download, count: null },
    { id: 'enhancer', label: 'DSP', icon: Sliders, count: null },
    { id: 'profiles', label: 'Perfiles', icon: User, count: null },
  ]

  return (
    <header className="sticky top-0 z-50 glass-premium-strong border-b border-gold-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo PREMIUM */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold-400 via-neon-green to-gold-500 flex items-center justify-center pulse-ring-premium">
              <Music className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-gold hidden sm:block tracking-wider">
              MI EMISORA
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-black shadow-lg glow-gold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-black' : ''}`} />
                <span>{item.label}</span>
                {item.count !== null && item.count > 0 && (
                  <span className="bg-black/20 px-2 py-0.5 rounded-full text-sm font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Theme Customizer */}
            <ThemeCustomizer 
              currentTheme={currentTheme} 
              onThemeChange={onThemeChange}
            />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full glass-premium text-white/70 hover:text-gold-400 hover:border-gold-400/50 transition-all border border-transparent"
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any)
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.count !== null && item.count > 0 && (
                  <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-sm">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
