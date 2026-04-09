export interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  coverUrl: string
  audioUrl: string
  genre: string
  year: number
  rating?: number
  license?: string
}

export interface Playlist {
  id: string
  name: string
  songs: Song[]
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  isPremium: boolean
  subscriptionType?: 'free' | 'basic' | 'premium'
}
