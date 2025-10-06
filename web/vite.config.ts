import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

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
          { src: 'vite.svg', sizes: 'any', type: 'image/svg+xml' },
          { src: 'icon.svg', sizes: '192x192', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  define: {
    global: 'globalThis', // Essential for Supabase
    'process.env': {}, // Allow Vite to inject env vars
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js'], // Ensure Supabase is optimized
  },
  server: {
    host: true,
    port: 3000,
    https: false,
  },
});