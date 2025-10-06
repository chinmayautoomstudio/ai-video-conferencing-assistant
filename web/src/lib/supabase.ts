import { createClient } from '@supabase/supabase-js';

console.log('🔧 [SUPABASE] Initializing Supabase client...');

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://jkonlgbqvqxrazwsptxo.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb25sZ2JxdnF4cmF6d3NwdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTc1MTIsImV4cCI6MjA3NTA3MzUxMn0.rh-bP1FNvhOqIZawoB-r9rBKXTrBi9pjYbWif_qZqnc';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  throw new Error('Missing Supabase configuration');
}

// Create Supabase client with minimal configuration
let supabase: any = null;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client created successfully');

  // Test the client
  supabase
    .from('meetings')
    .select('count')
    .limit(1)
    .then((result: any) => {
      console.log('✅ Supabase client test query successful:', result);
    })
    .catch((error: any) => {
      console.error('❌ Supabase client test query failed:', error);
      // Don't throw here to prevent app crash
    });
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error);
  const errorMessage = error instanceof Error ? error.message : String(error);
  throw new Error(`Supabase client creation failed: ${errorMessage}`);
}

export { supabase };

// Database types
export interface Meeting {
  id: string;
  room_id: string;
  created_at: string;
  created_by: string;
  is_active: boolean;
  max_participants: number;
  settings: {
    allow_screen_share: boolean;
    allow_recording: boolean;
    require_approval: boolean;
  };
}

export interface Participant {
  id: string;
  meeting_id: string;
  user_id: string;
  user_name: string;
  joined_at: string;
  is_host: boolean;
  is_video_enabled: boolean;
  is_audio_enabled: boolean;
  is_speaking: boolean;
  is_muted: boolean;
  connection_status: 'connected' | 'disconnected' | 'connecting';
}

export interface ChatMessage {
  id: string;
  meeting_id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
  message_type: 'text' | 'system';
}

export interface RealtimeEvent {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: any;
  old?: any;
}