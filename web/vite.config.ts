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
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          },
          {
            src: 'icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
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
    'process.env': '{}',
    'process.browser': 'true',
    'process.platform': '"browser"',
    'process.version': '"v16.0.0"',
    'process.nextTick': 'setTimeout',
    'process.cwd': '() => "/"',
    'process.chdir': '() => {}',
    'process.umask': '() => 0',
    'process.hrtime': '() => [0, 0]',
    'process.uptime': '() => 0',
    'process.kill': '() => {}',
    'process.exit': '() => {}',
    'process.on': '() => {}',
    'process.off': '() => {}',
    'process.emit': '() => {}',
    'process.addListener': '() => {}',
    'process.removeListener': '() => {}',
    'process.removeAllListeners': '() => {}',
    'process.setMaxListeners': '() => {}',
    'process.getMaxListeners': '() => 0',
    'process.listeners': '() => []',
    'process.rawListeners': '() => []',
    'process.listenerCount': '() => 0',
    'process.eventNames': '() => []',
    'process.prependListener': '() => {}',
    'process.prependOnceListener': '() => {}',
    'process.once': '() => {}',
    'Buffer.isBuffer': '() => false',
    'Buffer.from': '() => new Uint8Array()',
    'Buffer.alloc': '() => new Uint8Array()',
    'Buffer.allocUnsafe': '() => new Uint8Array()',
    'Buffer.concat': '() => new Uint8Array()',
    'Buffer.compare': '() => 0',
    'Buffer.copy': '() => 0',
    'Buffer.equals': '() => false',
    'Buffer.fill': '() => {}',
    'Buffer.indexOf': '() => -1',
    'Buffer.lastIndexOf': '() => -1',
    'Buffer.readDoubleBE': '() => 0',
    'Buffer.readDoubleLE': '() => 0',
    'Buffer.readFloatBE': '() => 0',
    'Buffer.readFloatLE': '() => 0',
    'Buffer.readInt8': '() => 0',
    'Buffer.readInt16BE': '() => 0',
    'Buffer.readInt16LE': '() => 0',
    'Buffer.readInt32BE': '() => 0',
    'Buffer.readInt32LE': '() => 0',
    'Buffer.readIntBE': '() => 0',
    'Buffer.readIntLE': '() => 0',
    'Buffer.readUInt8': '() => 0',
    'Buffer.readUInt16BE': '() => 0',
    'Buffer.readUInt16LE': '() => 0',
    'Buffer.readUInt32BE': '() => 0',
    'Buffer.readUInt32LE': '() => 0',
    'Buffer.readUIntBE': '() => 0',
    'Buffer.readUIntLE': '() => 0',
    'Buffer.subarray': '() => new Uint8Array()',
    'Buffer.swap16': '() => {}',
    'Buffer.swap32': '() => {}',
    'Buffer.swap64': '() => {}',
    'Buffer.toJSON': '() => ({ type: "Buffer", data: [] })',
    'Buffer.toString': '() => ""',
    'Buffer.write': '() => 0',
    'Buffer.writeDoubleBE': '() => 0',
    'Buffer.writeDoubleLE': '() => 0',
    'Buffer.writeFloatBE': '() => 0',
    'Buffer.writeFloatLE': '() => 0',
    'Buffer.writeInt8': '() => 0',
    'Buffer.writeInt16BE': '() => 0',
    'Buffer.writeInt16LE': '() => 0',
    'Buffer.writeInt32BE': '() => 0',
    'Buffer.writeInt32LE': '() => 0',
    'Buffer.writeIntBE': '() => 0',
    'Buffer.writeIntLE': '() => 0',
    'Buffer.writeUInt8': '() => 0',
    'Buffer.writeUInt16BE': '() => 0',
    'Buffer.writeUInt16LE': '() => 0',
    'Buffer.writeUInt32BE': '() => 0',
    'Buffer.writeUInt32LE': '() => 0',
    'Buffer.writeUIntBE': '() => 0',
    'Buffer.writeUIntLE': '() => 0',
    'setImmediate': 'setTimeout',
    'clearImmediate': 'clearTimeout'
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
