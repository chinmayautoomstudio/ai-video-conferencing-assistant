// CRITICAL: Create d.global object IMMEDIATELY before any imports
// This must happen before Supabase tries to access d.global
console.log('🔧 [PRE-IMPORT] Creating d.global object...');

// Create a comprehensive global object
const createPreImportGlobalObject = () => {
  return {
    headers: {},
    process: {},
    Buffer: {},
    fetch: typeof fetch !== 'undefined' ? fetch : undefined,
    XMLHttpRequest: typeof XMLHttpRequest !== 'undefined' ? XMLHttpRequest : undefined,
    WebSocket: typeof WebSocket !== 'undefined' ? WebSocket : undefined,
    global: globalThis,
    setImmediate: function(fn: Function) { return setTimeout(fn, 0); },
    clearImmediate: clearTimeout
  };
};

// Apply to globalThis
if (typeof globalThis !== 'undefined') {
  (globalThis as any).d = { global: createPreImportGlobalObject() };
  console.log('🔧 [PRE-IMPORT] d.global created on globalThis:', typeof (globalThis as any).d?.global !== 'undefined');
}

// Apply to window
if (typeof window !== 'undefined') {
  (window as any).d = { global: createPreImportGlobalObject() };
  console.log('🔧 [PRE-IMPORT] d.global created on window:', typeof (window as any).d?.global !== 'undefined');
}

// Apply to self
if (typeof self !== 'undefined') {
  (self as any).d = { global: createPreImportGlobalObject() };
  console.log('🔧 [PRE-IMPORT] d.global created on self:', typeof (self as any).d?.global !== 'undefined');
}

import { createClient } from '@supabase/supabase-js';

// CRITICAL: Apply polyfills immediately before any Supabase operations
console.log('🔧 [SUPABASE POLYFILLS] Applying critical polyfills...');

// Global polyfill - most critical for Supabase
if (typeof global === 'undefined') {
  console.log('🔧 [SUPABASE POLYFILLS] Adding global polyfill');
  (globalThis as any).global = globalThis;
  if (typeof window !== 'undefined') {
    (window as any).global = globalThis;
  }
  if (typeof self !== 'undefined') {
    (self as any).global = globalThis;
  }
}

// Process polyfill - comprehensive
if (typeof process === 'undefined') {
  console.log('🔧 [SUPABASE POLYFILLS] Adding process polyfill');
  const processPolyfill = {
    env: {},
    browser: true,
    nextTick: function(fn: Function) { return setTimeout(fn, 0); },
    version: 'v16.0.0',
    platform: 'browser',
    cwd: function() { return '/'; },
    chdir: function() {},
    umask: function() { return 0; },
    hrtime: function() { return [0, 0]; },
    uptime: function() { return 0; },
    kill: function() {},
    exit: function() {},
    on: function() {},
    off: function() {},
    emit: function() {},
    addListener: function() {},
    removeListener: function() {},
    removeAllListeners: function() {},
    setMaxListeners: function() {},
    getMaxListeners: function() { return 0; },
    listeners: function() { return []; },
    rawListeners: function() { return []; },
    listenerCount: function() { return 0; },
    eventNames: function() { return []; },
    prependListener: function() {},
    prependOnceListener: function() {},
    once: function() {},
    hasOwnProperty: Object.prototype.hasOwnProperty,
    isPrototypeOf: Object.prototype.isPrototypeOf,
    propertyIsEnumerable: Object.prototype.propertyIsEnumerable,
    toString: function() { return '[object process]'; },
    valueOf: function() { return processPolyfill; }
  };
  
  (globalThis as any).process = processPolyfill;
  if (typeof window !== 'undefined') {
    (window as any).process = processPolyfill;
  }
  if (typeof self !== 'undefined') {
    (self as any).process = processPolyfill;
  }
}

// Buffer polyfill
if (typeof Buffer === 'undefined') {
  console.log('🔧 [SUPABASE POLYFILLS] Adding Buffer polyfill');
  const bufferPolyfill = {
    isBuffer: function() { return false; },
    from: function() { return new Uint8Array(); },
    alloc: function() { return new Uint8Array(); },
    allocUnsafe: function() { return new Uint8Array(); },
    concat: function() { return new Uint8Array(); },
    compare: function() { return 0; },
    copy: function() { return 0; },
    equals: function() { return false; },
    fill: function() { return bufferPolyfill; },
    indexOf: function() { return -1; },
    lastIndexOf: function() { return -1; },
    readDoubleBE: function() { return 0; },
    readDoubleLE: function() { return 0; },
    readFloatBE: function() { return 0; },
    readFloatLE: function() { return 0; },
    readInt8: function() { return 0; },
    readInt16BE: function() { return 0; },
    readInt16LE: function() { return 0; },
    readInt32BE: function() { return 0; },
    readInt32LE: function() { return 0; },
    readIntBE: function() { return 0; },
    readIntLE: function() { return 0; },
    readUInt8: function() { return 0; },
    readUInt16BE: function() { return 0; },
    readUInt32BE: function() { return 0; },
    readUInt32LE: function() { return 0; },
    readUIntBE: function() { return 0; },
    readUIntLE: function() { return 0; },
    subarray: function() { return new Uint8Array(); },
    swap16: function() { return bufferPolyfill; },
    swap32: function() { return bufferPolyfill; },
    swap64: function() { return bufferPolyfill; },
    toJSON: function() { return { type: 'Buffer', data: [] }; },
    toString: function() { return ''; },
    write: function() { return 0; },
    writeDoubleBE: function() { return 0; },
    writeDoubleLE: function() { return 0; },
    writeFloatBE: function() { return 0; },
    writeFloatLE: function() { return 0; },
    writeInt8: function() { return 0; },
    writeInt16BE: function() { return 0; },
    writeInt16LE: function() { return 0; },
    writeInt32BE: function() { return 0; },
    writeInt32LE: function() { return 0; },
    writeIntBE: function() { return 0; },
    writeIntLE: function() { return 0; },
    writeUInt8: function() { return 0; },
    writeUInt16BE: function() { return 0; },
    writeUInt32BE: function() { return 0; },
    writeUInt32LE: function() { return 0; }
  };
  
  (globalThis as any).Buffer = bufferPolyfill;
  if (typeof window !== 'undefined') {
    (window as any).Buffer = bufferPolyfill;
  }
  if (typeof self !== 'undefined') {
    (self as any).Buffer = bufferPolyfill;
  }
}

// Additional globals
if (typeof setImmediate === 'undefined') {
  (globalThis as any).setImmediate = function(fn: Function) { return setTimeout(fn, 0); };
  if (typeof window !== 'undefined') {
    (window as any).setImmediate = function(fn: Function) { return setTimeout(fn, 0); };
  }
}

if (typeof clearImmediate === 'undefined') {
  (globalThis as any).clearImmediate = clearTimeout;
  if (typeof window !== 'undefined') {
    (window as any).clearImmediate = clearTimeout;
  }
}

// Create comprehensive global object for Supabase internal dependencies
const createGlobalObject = () => {
  const globalObj = {
    global: globalThis,
    process: (globalThis as any).process || {},
    Buffer: (globalThis as any).Buffer || {},
    setImmediate: (globalThis as any).setImmediate || function(fn: Function) { return setTimeout(fn, 0); },
    clearImmediate: (globalThis as any).clearImmediate || clearTimeout,
    headers: {}, // Add headers object that Supabase might be looking for
    fetch: typeof fetch !== 'undefined' ? fetch : undefined,
    XMLHttpRequest: typeof XMLHttpRequest !== 'undefined' ? XMLHttpRequest : undefined,
    WebSocket: typeof WebSocket !== 'undefined' ? WebSocket : undefined
  };
  
  // Make it available globally
  (globalThis as any).globalObject = globalObj;
  if (typeof window !== 'undefined') {
    (window as any).globalObject = globalObj;
  }
  
  // CRITICAL: Create 'd' object with 'global' property that Supabase is looking for
  const dObject = {
    global: globalObj,
    headers: {},
    process: (globalThis as any).process || {},
    Buffer: (globalThis as any).Buffer || {}
  };
  
  (globalThis as any).d = dObject;
  if (typeof window !== 'undefined') {
    (window as any).d = dObject;
  }
  
  return globalObj;
};

createGlobalObject();

// CRITICAL: Ensure d.global is available immediately
console.log('🔧 [SUPABASE POLYFILLS] Verifying d.global availability...');
console.log('🔧 [SUPABASE POLYFILLS] d object exists:', typeof (globalThis as any).d !== 'undefined');
console.log('🔧 [SUPABASE POLYFILLS] d.global exists:', typeof (globalThis as any).d?.global !== 'undefined');
console.log('🔧 [SUPABASE POLYFILLS] d.global.headers exists:', typeof (globalThis as any).d?.global?.headers !== 'undefined');

console.log('🔧 [SUPABASE POLYFILLS] Polyfills applied successfully');
console.log('🔧 [SUPABASE POLYFILLS] Global available:', typeof global !== 'undefined');
console.log('🔧 [SUPABASE POLYFILLS] Process available:', typeof process !== 'undefined');
console.log('🔧 [SUPABASE POLYFILLS] Buffer available:', typeof Buffer !== 'undefined');
console.log('🔧 [SUPABASE POLYFILLS] Global object created:', typeof (globalThis as any).globalObject !== 'undefined');
console.log('🔧 [SUPABASE POLYFILLS] D object created:', typeof (globalThis as any).d !== 'undefined');

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://jkonlgbqvqxrazwsptxo.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb25sZ2JxdnF4cmF6d3NwdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTc1MTIsImV4cCI6MjA3NTA3MzUxMn0.rh-bP1FNvhOqIZawoB-r9rBKXTrBi9pjYbWif_qZqnc';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  throw new Error('Missing Supabase configuration');
}

console.log('✅ Polyfills verified - global is available');

// FINAL VERIFICATION: Ensure d.global is accessible before creating Supabase client
console.log('🔧 [FINAL CHECK] Verifying d.global before Supabase client creation...');
console.log('🔧 [FINAL CHECK] globalThis.d.global exists:', typeof (globalThis as any).d?.global !== 'undefined');
console.log('🔧 [FINAL CHECK] window.d.global exists:', typeof (window as any).d?.global !== 'undefined');
console.log('🔧 [FINAL CHECK] d.global.headers exists:', typeof (globalThis as any).d?.global?.headers !== 'undefined');

// Force create d.global if it doesn't exist
if (typeof (globalThis as any).d?.global === 'undefined') {
  console.log('🔧 [FINAL CHECK] Force creating d.global...');
  
  // Create the global object directly
  const forceGlobalObject = {
    headers: {},
    process: {},
    Buffer: {},
    fetch: typeof fetch !== 'undefined' ? fetch : undefined,
    XMLHttpRequest: typeof XMLHttpRequest !== 'undefined' ? XMLHttpRequest : undefined,
    WebSocket: typeof WebSocket !== 'undefined' ? WebSocket : undefined,
    global: globalThis,
    setImmediate: function(fn: Function) { return setTimeout(fn, 0); },
    clearImmediate: clearTimeout
  };
  
  (globalThis as any).d = { global: forceGlobalObject };
  if (typeof window !== 'undefined') {
    (window as any).d = { global: forceGlobalObject };
  }
  if (typeof self !== 'undefined') {
    (self as any).d = { global: forceGlobalObject };
  }
  
  console.log('🔧 [FINAL CHECK] d.global force created:', typeof (globalThis as any).d?.global !== 'undefined');
  console.log('🔧 [FINAL CHECK] d.global.headers exists:', typeof (globalThis as any).d?.global?.headers !== 'undefined');
}

// Create Supabase client
let supabase: any = null;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      flowType: 'implicit',
    },
  });
  console.log('✅ Supabase client created successfully');

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