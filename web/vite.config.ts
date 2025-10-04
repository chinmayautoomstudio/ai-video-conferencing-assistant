import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'AI Video Conference Assistant',
        short_name: 'VideoChat',
        description: 'Cross-platform video conferencing application',
        theme_color: '#1f2937',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis', // Polyfill for Supabase and other libs expecting Node.js global
    process: 'globalThis.process', // Polyfill for process object
    'process.env': '{}',
    'process.nextTick': 'setTimeout',
    'process.browser': 'true',
    'process.platform': '"browser"',
    'process.version': '"v16.0.0"'
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js'],
    exclude: ['simple-peer']
  },
  server: {
    host: true,
    port: 3000,
    https: false
  }
})
