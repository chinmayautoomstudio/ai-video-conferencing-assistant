import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to fix Supabase d.global issue
    {
      name: 'supabase-d-global-fix',
      generateBundle(options, bundle) {
        // Find the main bundle
        for (const fileName in bundle) {
          const chunk = bundle[fileName];
          if (chunk.type === 'chunk' && chunk.isEntry) {
            // Add d.global polyfill at the beginning of the bundle
            chunk.code = `
              // Fix for Supabase d.global issue
              if (typeof globalThis !== 'undefined') {
                if (!globalThis.d) globalThis.d = {};
                if (!globalThis.d.global) {
                  globalThis.d.global = {
                    headers: {},
                    process: globalThis.process || {},
                    Buffer: globalThis.Buffer || {},
                    fetch: globalThis.fetch,
                    XMLHttpRequest: globalThis.XMLHttpRequest,
                    WebSocket: globalThis.WebSocket
                  };
                }
              }
              ${chunk.code}
            `;
          }
        }
      }
    },
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
    global: 'globalThis', // Essential polyfill
    'process.env': {}, // Allow Vite to inject env vars
    'process.browser': 'true',
    'process.platform': '"browser"',
    'process.version': '"v16.0.0"',
    'process.nextTick': 'setTimeout',
    'Buffer.isBuffer': '() => false',
    'Buffer.from': '() => new Uint8Array()',
    'Buffer.alloc': '() => new Uint8Array()',
    'setImmediate': 'setTimeout',
    'clearImmediate': 'clearTimeout',
    // CRITICAL: Fix for Supabase d.global issue
    'd.global': 'globalThis',
    'd.global.headers': '{}',
    'd.global.process': '{}',
    'd.global.Buffer': '{}'
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js'],
  },
  server: {
    host: true,
    port: 3000,
    https: false,
  },
});