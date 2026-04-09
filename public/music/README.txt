🎵 CARPETA PARA TU MÚSICA LOCAL
═══════════════════════════════════════════════════════════

📂 INSTRUCCIONES PARA AGREGAR TUS PROPIAS CANCIONES:

1. COPIA tus archivos MP3 a esta carpeta:
   d:\Desarrollo\Mi-emisora\mi-emisora-web\public\music\

2. ABRE el archivo de configuración de canciones:
   d:\Desarrollo\Mi-emisora\mi-emisora-web\src\data\songs.ts

3. AGREGA tu canción al array mockSongs siguiendo este formato:

   {
     id: '13',                          // Número único
     title: 'Nombre de tu canción',     // Título
     artist: 'Nombre del artista',      // Artista
     album: 'Nombre del álbum',         // Álbum
     duration: 180,                     // Duración en segundos
     coverUrl: 'https://images.unsplash.com/...',  // URL de imagen
     audioUrl: '/music/tu-cancion.mp3', // Ruta local (¡IMPORTANTE!)
     genre: 'Rock',                     // Género
     year: 2024                         // Año
   }

4. REINICIA el servidor:
   npm run dev

5. ¡LISTO! Tu canción aparecerá en la emisora

═══════════════════════════════════════════════════════════

🌐 FUENTES DE MÚSICA CREATIVE COMMONS (GRATIS):

Si quieres más música gratuita y legal, visita:

• Free Music Archive: https://freemusicarchive.org/
• Incompetech: https://incompetech.com/music/royalty-free/music.html
• ccMixter: http://ccmixter.org/
• MusOpen: https://musopen.org/
• FreePD: https://freepd.com/

═══════════════════════════════════════════════════════════

💡 CONSEJOS:

• Usa archivos MP3 para mejor compatibilidad
• Nombres de archivo sin espacios: "mi-cancion.mp3"
• Imágenes de portada: busca en Unsplash.com
• Reinicia siempre después de agregar canciones

═══════════════════════════════════════════════════════════

🎸 ¡TU EMISORA TE ESPERA!
