# Mi Emisora Web 🎵

Una emisora de streaming de música moderna, vibrante y energética construida con React, TypeScript y TailwindCSS.

## 🚀 Características

- 🎶 **Reproductor de streaming** MP3 con controles completos
- 🔍 **Búsqueda y filtros** por género, artista, álbum
- ❤️ **Sistema de favoritos** guardado en localStorage
- 📋 **Listas de reproducción** personalizadas
- 🎨 **Visualizador de audio** animado en tiempo real
- 📱 **Diseño responsive** para móvil y desktop
- 🌙 **Interfaz vibrante** con gradientes y animaciones neón
- 💾 **Persistencia de datos** local (sin backend necesario)

## 🛠️ Tecnologías

- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide React (iconos)
- Web Audio API

## 📦 Instalación

1. **Navega a la carpeta del proyecto:**
   ```bash
   cd mi-emisora-web
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Agrega tus archivos MP3:**
   - Crea la carpeta `public/music/`
   - Copia tus archivos MP3 allí
   - Actualiza las rutas en `src/data/songs.ts`

4. **Ejecuta el proyecto:**
   ```bash
   npm run dev
   ```

5. **Abre en tu navegador:**
   - La aplicación se abrirá automáticamente en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
mi-emisora-web/
├── public/
│   └── music/              # Tus archivos MP3
├── src/
│   ├── components/         # Componentes React
│   │   ├── Header.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── SongList.tsx
│   │   ├── Visualizer.tsx
│   │   ├── Favorites.tsx
│   │   └── Playlists.tsx
│   ├── data/
│   │   └── songs.ts        # Catálogo de canciones
│   ├── types/
│   │   └── index.ts        # Tipos TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🎨 Personalización

### Cambiar el diseño
- Modifica los colores en `tailwind.config.js`
- Ajusta los gradientes en `src/index.css`
- Cambia las animaciones en las clases CSS

### Agregar más canciones
Edita `src/data/songs.ts` y añade nuevos objetos siguiendo la estructura:

```typescript
{
  id: '9',
  title: 'Nombre de la canción',
  artist: 'Nombre del artista',
  album: 'Nombre del álbum',
  duration: 180, // segundos
  coverUrl: 'https://url-de-la-caratura.jpg',
  audioUrl: '/music/tu-archivo.mp3',
  genre: 'Pop',
  year: 2024
}
```

## 💰 Futuras funcionalidades para monetización

- Sistema de autenticación de usuarios
- Suscripciones premium
- Anuncios integrados
- Pasarelas de pago
- Analíticas de escucha
- Descarga offline (premium)

## 📝 Licencia

Proyecto personal para uso comercial futuro.

## 🤝 Soporte

¿Necesitas ayuda? Contacta al desarrollador para asistencia personalizada.

---

**Desarrollado con ❤️ para tu emisora de streaming**
