import { useState, useEffect } from 'react'
import Header from './components/Header'
import AudioPlayer from './components/AudioPlayer'
import SongList from './components/SongList'
// Visualizer component imported but using RealTimeVisualizer instead
import Favorites from './components/Favorites'
import Playlists from './components/Playlists'
import MiniPlayer from './components/MiniPlayer'
import Statistics from './components/Statistics'
import RealTimeVisualizer from './components/RealTimeVisualizer'
import PlaylistManager from './components/PlaylistManager'
import AIRecommendations from './components/AIRecommendations'
import SmartPlaylists from './components/SmartPlaylists'
import UserProfiles from './components/UserProfiles'
import RadioFM from './components/RadioFM'
import MoodDetector from './components/MoodDetector'
import CollaborativePlaylists from './components/CollaborativePlaylists'
import NowPlaying from './components/NowPlaying'
import Podcasts from './components/Podcasts'
import LiveLyrics from './components/LiveLyrics'
import CloudSync from './components/CloudSync'
import OfflineMode from './components/OfflineMode'
import AudioEnhancer from './components/AudioEnhancer'
import type { Song, Playlist } from './types'
import { mockSongs } from './data/songs'

function App() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [favorites, setFavorites] = useState<Song[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'playlists' | 'history' | 'stats' | 'recommendations' | 'smart' | 'radio' | 'profiles' | 'mood' | 'collaborative' | 'nowplaying' | 'podcasts' | 'lyrics' | 'cloud' | 'offline' | 'enhancer'>('all')
  const [queue, setQueue] = useState<Song[]>([])
  const [showQueue, setShowQueue] = useState(false)
  const [showMiniPlayer, setShowMiniPlayer] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [history, setHistory] = useState<Song[]>([])
  
  // FASE 3: Themes
  type ThemeName = 'premium' | 'neon' | 'ocean' | 'sunset' | 'forest' | 'midnight'
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('premium')
  
  // FASE 3: Statistics
  const [stats, setStats] = useState({
    totalListeningTime: 0,
    songsPlayed: 0,
    mostPlayedSongs: [] as { song: Song; count: number }[],
    dailyStats: {} as Record<string, number>
  })

  // FASE 4: Radio FM state
  const [currentRadioStation, setCurrentRadioStation] = useState<{
    id: string
    name: string
    streamUrl: string
    genre: string
    logo: string
    country?: string
    listeners?: number
    isOnline?: boolean
    bitrate?: number
    language?: string
  } | null>(null)
  const [isRadioPlaying, setIsRadioPlaying] = useState(false)

  // FASE 4: Mood
  const [currentMood, setCurrentMood] = useState('happy')
  
  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      setIsDarkMode(savedTheme === 'true')
    }
  }, [])

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString())
    // Apply theme class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImportPlaylists = (importedPlaylists: Playlist[]) => {
    setPlaylists(prev => {
      const existingIds = new Set(prev.map(p => p.id))
      const newPlaylists = importedPlaylists.filter(p => !existingIds.has(p.id))
      return [...prev, ...newPlaylists]
    })
  }

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    const savedPlaylists = localStorage.getItem('playlists')
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists))
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists))
  }, [playlists])

  const toggleFavorite = (song: Song) => {
    if (favorites.find(f => f.id === song.id)) {
      setFavorites(favorites.filter(f => f.id !== song.id))
    } else {
      setFavorites([...favorites, song])
    }
  }

  const addToPlaylist = (song: Song, playlistId: string) => {
    setPlaylists(playlists.map(p => 
      p.id === playlistId 
        ? { ...p, songs: [...p.songs, song] }
        : p
    ))
  }

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songs: [],
      createdAt: new Date().toISOString()
    }
    setPlaylists([...playlists, newPlaylist])
  }

  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter(p => p.id !== id))
  }

  // Queue functions
  const addToQueue = (song: Song) => {
    setQueue(prev => [...prev, song])
  }

  // const removeFromQueue = (songId: string) => {
  //   setQueue(prev => prev.filter(s => s.id !== songId))
  // }

  const playNextInQueue = () => {
    if (queue.length > 0) {
      const nextSong = queue[0]
      setCurrentSong(nextSong)
      setQueue(prev => prev.slice(1))
      setIsPlaying(true)
    } else if (currentSong) {
      // Play next from all songs if queue is empty
      const currentIndex = mockSongs.findIndex(s => s.id === currentSong.id)
      const nextIndex = (currentIndex + 1) % mockSongs.length
      setCurrentSong(mockSongs[nextIndex])
    }
  }

  // const clearQueue = () => {
  //   setQueue([])
  // }

  const handlePlay = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    
    // Add to history (avoid duplicates at the top)
    setHistory(prev => {
      const filtered = prev.filter(s => s.id !== song.id)
      return [song, ...filtered].slice(0, 50) // Keep last 50 songs
    })
    
    // FASE 3: Update statistics
    const today = new Date().toISOString().split('T')[0]
    setStats(prev => {
      const existingSong = prev.mostPlayedSongs.find(s => s.song.id === song.id)
      let newMostPlayed = prev.mostPlayedSongs
      
      if (existingSong) {
        newMostPlayed = prev.mostPlayedSongs.map(s => 
          s.song.id === song.id ? { ...s, count: s.count + 1 } : s
        ).sort((a, b) => b.count - a.count)
      } else {
        newMostPlayed = [...prev.mostPlayedSongs, { song, count: 1 }]
          .sort((a, b) => b.count - a.count)
      }
      
      return {
        ...prev,
        songsPlayed: prev.songsPlayed + 1,
        mostPlayedSongs: newMostPlayed,
        dailyStats: {
          ...prev.dailyStats,
          [today]: (prev.dailyStats[today] || 0) + song.duration
        }
      }
    })
  }

  // FASE 3: Track listening time
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isPlaying) {
      interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          totalListeningTime: prev.totalListeningTime + 1
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          setIsPlaying(prev => !prev)
          break
        case 'ArrowRight':
          if (e.shiftKey) {
            playNextInQueue()
          }
          break
        case 'ArrowLeft':
          if (e.shiftKey && currentSong) {
            const currentIndex = mockSongs.findIndex(s => s.id === currentSong.id)
            const prevIndex = (currentIndex - 1 + mockSongs.length) % mockSongs.length
            setCurrentSong(mockSongs[prevIndex])
          }
          break
        case 'KeyM':
          // Toggle mute would go here if we had access to the audio player state
          break
        case 'KeyF':
          if (currentSong) {
            toggleFavorite(currentSong)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSong, isPlaying])

  useEffect(() => {
    const handleScroll = () => {
      // Show mini player when scrolled down more than 300px
      setShowMiniPlayer(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  return (
    <div className="min-h-screen premium-bg relative">
      {/* Blobs animados de fondo */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      
      <div className="relative z-10">
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          favoritesCount={favorites.length}
          playlistsCount={playlists.length}
          historyCount={history.length}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          currentTheme={currentTheme}
          onThemeChange={(theme: string) => setCurrentTheme(theme as ThemeName)}
        />
        
        <main className="container mx-auto px-4 pb-32">
          {/* Hero Section PREMIUM */}
          <section className="py-12">
            <div className="glass-premium rounded-3xl p-10 mb-8 border-glow">
              <div className="text-center mb-8">
                <h1 className="text-6xl md:text-7xl font-black text-gradient-premium mb-6 tracking-tight">
                  MI EMISORA
                </h1>
                <p className="text-xl md:text-2xl text-white/80 font-light">
                  Experiencia Musical <span className="text-gold font-semibold">PREMIUM</span>
                </p>
                <div className="flex justify-center gap-2 mt-6">
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                  <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse delay-75"></span>
                  <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse delay-150"></span>
                </div>
              </div>
              
              {currentSong && isPlaying && (
                <RealTimeVisualizer 
                  audioElement={audioElement} 
                  isPlaying={isPlaying} 
                />
              )}
            </div>
          </section>

        {/* Content based on active tab */}
        {activeTab === 'all' && (
          <SongList 
            songs={mockSongs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            favorites={favorites}
            onPlay={handlePlay}
            onToggleFavorite={toggleFavorite}
            onAddToPlaylist={addToPlaylist}
            onAddToQueue={addToQueue}
            playlists={playlists}
          />
        )}

        {activeTab === 'favorites' && (
          <Favorites 
            favorites={favorites}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlay={setCurrentSong}
            onToggleFavorite={toggleFavorite}
            onRemove={(song) => setFavorites(favorites.filter(f => f.id !== song.id))}
          />
        )}

        {activeTab === 'playlists' && (
          <>
            <Playlists 
              playlists={playlists}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlay={setCurrentSong}
              onCreatePlaylist={createPlaylist}
              onDeletePlaylist={deletePlaylist}
              onAddToPlaylist={addToPlaylist}
            />
            <div className="mt-8">
              <PlaylistManager 
                playlists={playlists}
                onImportPlaylists={handleImportPlaylists}
                songs={mockSongs}
              />
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Historial de Reproducción</h2>
              <button
                onClick={() => setHistory([])}
                className="px-4 py-2 rounded-full glass-premium text-sm text-white/70 hover:text-white transition-colors"
              >
                Limpiar historial
              </button>
            </div>
            {history.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <p>No has reproducido ninguna canción aún</p>
              </div>
            ) : (
              <SongList 
                songs={history}
                currentSong={currentSong}
                isPlaying={isPlaying}
                favorites={favorites}
                onPlay={handlePlay}
                onToggleFavorite={toggleFavorite}
                onAddToPlaylist={addToPlaylist}
                onAddToQueue={addToQueue}
                playlists={playlists}
              />
            )}
          </section>
        )}

        {activeTab === 'stats' && (
          <Statistics stats={stats} />
        )}

        {/* FASE 4: AI Recommendations */}
        {activeTab === 'recommendations' && (
          <AIRecommendations 
            songs={mockSongs}
            history={history}
            favorites={favorites}
            currentSong={currentSong}
            onPlay={handlePlay}
            onAddToQueue={addToQueue}
          />
        )}

        {/* FASE 4: Smart Playlists */}
        {activeTab === 'smart' && (
          <SmartPlaylists 
            songs={mockSongs}
            favorites={favorites}
            history={history}
            onPlay={handlePlay}
            onAddToQueue={addToQueue}
            onCreatePlaylist={(name, songs) => {
              const newPlaylist: Playlist = {
                id: Date.now().toString(),
                name,
                songs,
                createdAt: new Date().toISOString()
              }
              setPlaylists(prev => [...prev, newPlaylist])
            }}
          />
        )}

        {/* FASE 4: Radio FM */}
        {activeTab === 'radio' && (
          <RadioFM 
            onPlayStation={(station) => {
              setCurrentRadioStation(station)
              setIsRadioPlaying(true)
              // Stop regular music when radio starts
              setIsPlaying(false)
              setCurrentSong(null)
            }}
            currentStation={currentRadioStation as any}
            isPlaying={isRadioPlaying}
            onTogglePlay={() => setIsRadioPlaying(!isRadioPlaying)}
          />
        )}

        {/* FASE 4: User Profiles */}
        {activeTab === 'profiles' && (
          <UserProfiles 
            currentProfile={null}
            onProfileChange={() => {}}
            onCreateProfile={() => {}}
            onDeleteProfile={() => {}}
            onUpdateProfile={() => {}}
          />
        )}

        {/* FASE 4: Mood Detector */}
        {activeTab === 'mood' && (
          <MoodDetector 
            songs={mockSongs}
            currentMood={currentMood}
            onMoodChange={setCurrentMood}
            onPlay={handlePlay}
            onAddToQueue={addToQueue}
          />
        )}

        {/* FASE 4: Collaborative Playlists */}
        {activeTab === 'collaborative' && (
          <CollaborativePlaylists 
            currentUser="Usuario"
            songs={mockSongs}
            onPlay={handlePlay}
          />
        )}

        {/* FASE 4: Now Playing / Share */}
        {activeTab === 'nowplaying' && (
          <NowPlaying 
            currentSong={currentSong}
            isPlaying={isPlaying}
            listeners={Math.floor(Math.random() * 1000) + 500}
            onShare={() => console.log('Compartido')}
          />
        )}

        {/* FASE 4: Podcasts */}
        {activeTab === 'podcasts' && (
          <Podcasts />
        )}

        {/* FASE 4: Live Lyrics */}
        {activeTab === 'lyrics' && (
          <LiveLyrics 
            currentSong={currentSong}
            isPlaying={isPlaying}
            currentTime={Math.floor(Math.random() * 120)}
          />
        )}

        {/* FASE 4: Cloud Sync */}
        {activeTab === 'cloud' && (
          <CloudSync />
        )}

        {/* FASE 4: Offline Mode */}
        {activeTab === 'offline' && (
          <OfflineMode 
            songs={mockSongs}
            onPlay={handlePlay}
          />
        )}

        {/* FASE 4: Audio Enhancer */}
        {activeTab === 'enhancer' && (
          <AudioEnhancer />
        )}
      </main>
      </div>

      {/* Mini Player - shows when scrolled */}
      <MiniPlayer 
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={playNextInQueue}
        onPrevious={() => {
          if (currentSong) {
            const currentIndex = mockSongs.findIndex(s => s.id === currentSong.id)
            const prevIndex = (currentIndex - 1 + mockSongs.length) % mockSongs.length
            setCurrentSong(mockSongs[prevIndex])
          }
        }}
        isVisible={showMiniPlayer}
        onClick={scrollToTop}
      />

      {/* Fixed Audio Player at bottom */}
      <AudioPlayer 
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={playNextInQueue}
        onPrevious={() => {
          if (currentSong) {
            const currentIndex = mockSongs.findIndex(s => s.id === currentSong.id)
            const prevIndex = (currentIndex - 1 + mockSongs.length) % mockSongs.length
            setCurrentSong(mockSongs[prevIndex])
          }
        }}
        queueCount={queue.length}
        onToggleQueue={() => setShowQueue(!showQueue)}
        onAudioElementReady={setAudioElement}
      />
    </div>
  )
}

export default App
