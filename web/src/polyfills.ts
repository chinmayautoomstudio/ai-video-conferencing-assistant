// Enhanced polyfills for browser compatibility with Supabase

// Global polyfill - ensure global is available for Supabase
if (typeof global === 'undefined') {
  (window as any).global = globalThis;
}

// Process polyfill - ensure process object is available
if (typeof process === 'undefined') {
  (window as any).process = {
    env: {},
    browser: true,
    nextTick: (fn: Function) => setTimeout(fn, 0),
    version: 'v16.0.0'
  };
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

export {};
