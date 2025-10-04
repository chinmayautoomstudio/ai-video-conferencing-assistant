// Enhanced polyfills for browser compatibility with Supabase
// These must run immediately to ensure Supabase can access required globals

// Global polyfill - ensure global is available for Supabase
if (typeof global === 'undefined') {
  (window as any).global = globalThis;
  (globalThis as any).global = globalThis;
}

// Ensure global is available on window as well
if (typeof (window as any).global === 'undefined') {
  (window as any).global = globalThis;
}

// Process polyfill - ensure process object is available
if (typeof process === 'undefined') {
  const processPolyfill = {
    env: {},
    browser: true,
    nextTick: (fn: Function) => setTimeout(fn, 0),
    version: 'v16.0.0',
    platform: 'browser',
    cwd: () => '/',
    chdir: () => {},
    umask: () => 0,
    hrtime: () => [0, 0],
    uptime: () => 0,
    memoryUsage: () => ({
      rss: 0,
      heapTotal: 0,
      heapUsed: 0,
      external: 0,
      arrayBuffers: 0
    })
  };
  
  (window as any).process = processPolyfill;
  (globalThis as any).process = processPolyfill;
}

// Buffer polyfill
if (typeof Buffer === 'undefined') {
  // Simple fallback Buffer implementation
  (window as any).Buffer = {
    from: (data: any) => new Uint8Array(data),
    isBuffer: () => false
  }
}

// Crypto polyfill
if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
  (window as any).crypto = {
    getRandomValues: (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    }
  }
}

// Ensure polyfills are applied immediately
console.log('🔧 [DEBUG] Polyfills loaded - global:', typeof global, 'process:', typeof process);

// Export to ensure this module is loaded
export {};
