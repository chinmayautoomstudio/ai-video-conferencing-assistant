import { createClient } from '@supabase/supabase-js'

// Supabase configuration - try environment variables first, fallback to direct values
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://jkonlgbqvqxrazwsptxo.supabase.co'
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb25sZ2JxdnF4cmF6d3NwdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTc1MTIsImV4cCI6MjA3NTA3MzUxMn0.rh-bP1FNvhOqIZawoB-r9rBKXTrBi9pjYbWif_qZqnc'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...')

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration')
  throw new Error('Missing Supabase configuration')
}

// No mock client - we want the real Supabase to work!

// Create Supabase client with production-safe configuration
let supabase: any = null

// Always try to create the real Supabase client first
console.log('🔧 [DEBUG] Creating Supabase client with URL:', supabaseUrl)
console.log('🔧 [DEBUG] Creating Supabase client with Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...')

// Polyfills are loaded in main.tsx before this file is imported
// Verify polyfills are available
if (typeof global === 'undefined') {
  console.error('❌ Global polyfill not loaded! Check polyfills.ts')
  throw new Error('Global polyfill not available')
}

if (typeof process === 'undefined') {
  console.error('❌ Process polyfill not loaded! Check polyfills.ts')
  throw new Error('Process polyfill not available')
}

console.log('✅ Polyfills verified - global and process are available')

try {
  // Create client with minimal configuration to avoid browser compatibility issues
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      flowType: 'implicit'
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web'
      }
    }
  })
  console.log('✅ Supabase client created successfully')
  
  // Test the client by making a simple query
  supabase.from('meetings').select('count').limit(1).then((result: any) => {
    console.log('✅ Supabase client test query successful:', result)
  }).catch((error: any) => {
    console.error('❌ Supabase client test query failed:', error)
    // Don't fall back to mock - throw error to fix the issue
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Supabase test query failed: ${errorMessage}`)
  })
  
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error)
  // Don't fall back to mock - throw error to fix the issue
  const errorMessage = error instanceof Error ? error.message : String(error)
  throw new Error(`Supabase client creation failed: ${errorMessage}`)
}

export { supabase }

// Database types
export interface Meeting {
  id: string
  room_id: string
  created_at: string
  created_by: string
  is_active: boolean
  max_participants: number
  settings: {
    allow_screen_share: boolean
    allow_recording: boolean
    require_approval: boolean
  }
}

export interface Participant {
  id: string
  meeting_id: string
  user_id: string
  user_name: string
  joined_at: string
  is_host: boolean
  is_video_enabled: boolean
  is_audio_enabled: boolean
  is_speaking: boolean
  is_muted: boolean
  connection_status: 'connected' | 'disconnected' | 'connecting'
}

export interface ChatMessage {
  id: string
  meeting_id: string
  user_id: string
  user_name: string
  message: string
  created_at: string
  message_type: 'text' | 'system'
}

// Real-time subscription types
export interface RealtimeEvent {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new?: any
  old?: any
}
