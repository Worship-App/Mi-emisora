import type { Song } from '../types'

// 🎵 MÚSICA CREATIVE COMMONS (Legal y Gratuita)
// Estas canciones son de dominio público o Creative Commons
// Puedes reemplazarlas con tus propios MP3 en /public/music/

export const mockSongs: Song[] = [
  // 🎸 ROCK & ALTERNATIVO (Creative Commons)
  {
    id: '1',
    title: 'Epic Cinematic Rock',
    artist: 'Scott Buckley',
    album: 'Free Music Archive',
    duration: 184,
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e8?w=400&h=400&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Scott_Buckley/Enigma/Scott_Buckley_-_01_-_Jump.mp3',
    genre: 'Rock',
    year: 2023,
    license: 'CC BY 4.0'
  },
  {
    id: '2',
    title: 'Crystal Waters',
    artist: 'Broke For Free',
    album: 'Petal',
    duration: 245,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Broke_For_Free/Petal/Broke_For_Free_-_02_-_Something_Blue.mp3',
    genre: 'Electronic',
    year: 2023,
    license: 'CC BY 3.0'
  },
  {
    id: '3',
    title: 'Night Owl',
    artist: 'Broke For Free',
    album: 'Directionless EP',
    duration: 194,
    coverUrl: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3',
    genre: 'Ambient',
    year: 2023,
    license: 'CC BY 3.0'
  },
  {
    id: '4',
    title: 'The Great Unknown',
    artist: 'Incompetech',
    album: 'Royalty Free',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?w=400&h=400&fit=crop',
    audioUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/The%20Great%20Unknown.mp3',
    genre: 'Cinematic',
    year: 2023,
    license: 'CC BY 3.0'
  },
  {
    id: '5',
    title: 'African Drums',
    artist: 'Kevin MacLeod',
    album: 'World Music',
    duration: 178,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
    audioUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/African%20Drums.mp3',
    genre: 'World',
    year: 2023,
    license: 'CC BY 3.0'
  },
  {
    id: '6',
    title: 'Whiskey on the Rocks',
    artist: 'Incompetech',
    album: 'Blues & Rock',
    duration: 142,
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audioUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Whiskey%20on%20the%20Rocks.mp3',
    genre: 'Blues Rock',
    year: 2023,
    license: 'CC BY 3.0'
  },
  {
    id: '7',
    title: 'Acoustic Sunrise',
    artist: 'Scott Buckley',
    album: 'Morning Light',
    duration: 156,
    coverUrl: 'https://images.unsplash.com/photo-1504509546545-e000b4a62925?w=400&h=400&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Scott_Buckley/Morning_Light/Scott_Buckley_-_01_-_Sunrise.mp3',
    genre: 'Acoustic',
    year: 2023,
    license: 'CC BY 4.0'
  },
  {
    id: '8',
    title: 'Jazz Lounge',
    artist: 'Broke For Free',
    album: 'Jazz Sessions',
    duration: 267,
    coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Broke_For_Free/Jazz_Sessions/Broke_For_Free_-_01_-_Jazz_Lounge.mp3',
    genre: 'Jazz',
    year: 2023,
    license: 'CC BY 3.0'
  },

  // 🎹 CLÁSICA & INSTRUMENTAL (Dominio Público)
  {
    id: '9',
    title: 'Clair de Lune',
    artist: 'Claude Debussy',
    album: 'Suite Bergamasque',
    duration: 296,
    coverUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Claude_Debussy_-_Clair_de_lune.mp3',
    genre: 'Classical',
    year: 1905,
    license: 'Public Domain'
  },
  {
    id: '10',
    title: 'Moonlight Sonata',
    artist: 'Ludwig van Beethoven',
    album: 'Sonatas',
    duration: 345,
    coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Beethoven_Moonlight_Sonata_1st_movement.ogg',
    genre: 'Classical',
    year: 1801,
    license: 'Public Domain'
  },
  {
    id: '11',
    title: 'Gymnopédie No. 1',
    artist: 'Erik Satie',
    album: 'Gymnopédies',
    duration: 189,
    coverUrl: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=400&h=400&fit=crop',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Erik_Satie_-_Gymnop%C3%A9die_No._1.mp3',
    genre: 'Classical',
    year: 1888,
    license: 'Public Domain'
  },
  {
    id: '12',
    title: 'Four Seasons - Spring',
    artist: 'Antonio Vivaldi',
    album: 'The Four Seasons',
    duration: 194,
    coverUrl: 'https://images.unsplash.com/photo-1514117445516-2ecfc9c4ec90?w=400&h=400&fit=crop',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Vivaldi_-_Four_Seasons_-_Spring.ogg',
    genre: 'Baroque',
    year: 1725,
    license: 'Public Domain'
  },

  // 🎸 MÚSICA LOCAL (Placeholder - Agrega tus MP3 aquí)
  // Para agregar tu propia música, copia los archivos MP3 a:
  // d:\Desarrollo\Mi-emisora\mi-emisora-web\public\music\
  // Y actualiza las URLs abajo:
  
  /*
  {
    id: '13',
    title: 'Tu Canción Favorita',
    artist: 'Tu Artista',
    album: 'Tu Álbum',
    duration: 180,
    coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    audioUrl: '/music/tu-cancion.mp3',  // <-- Coloca tu MP3 aquí
    genre: 'Tu Género',
    year: 2024
  },
  */
]

// 📝 INSTRUCCIONES PARA AGREGAR TU PROPIA MÚSICA:
// 
// 1. Copia tus archivos MP3 a esta carpeta:
//    d:\Desarrollo\Mi-emisora\mi-emisora-web\public\music\
//
// 2. Agrega una nueva entrada al array mockSongs arriba con:
//    - id: número único
//    - title: nombre de la canción
//    - artist: nombre del artista
//    - album: nombre del álbum
//    - duration: duración en segundos
//    - coverUrl: URL de la imagen (puede ser de Unsplash)
//    - audioUrl: '/music/nombre-de-tu-archivo.mp3'
//    - genre: género musical
//    - year: año
//
// 3. Reinicia el servidor de desarrollo: npm run dev
//
// 4. ¡Listo! Tu canción aparecerá en la emisora

