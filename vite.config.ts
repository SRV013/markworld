import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'mark World — Mundiales de Fútbol',
        short_name: 'mark World',
        description: 'Estadísticas, campeones e historia de los Mundiales de Fútbol',
        theme_color: '#1d4ed8',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Toma control inmediato sin esperar a que el usuario cierre pestañas
        skipWaiting: true,
        clientsClaim: true,
        // Solo precachear JS, CSS, HTML e íconos pequeños
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        // Imágenes pesadas se sirven por runtime caching (no precache)
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp|avif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
