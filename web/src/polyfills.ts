// Global polyfills for Supabase compatibility
console.log('🔧 [POLYFILLS] Loading global polyfills...');

// Create comprehensive global object
const createGlobalPolyfills = () => {
  const globalObj = {
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

  // Apply to globalThis
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).d = { global: globalObj };
    (globalThis as any).global = globalThis;
    (globalThis as any).process = globalObj.process;
    (globalThis as any).Buffer = globalObj.Buffer;
    (globalThis as any).setImmediate = globalObj.setImmediate;
    (globalThis as any).clearImmediate = globalObj.clearImmediate;
  }

  // Apply to window
  if (typeof window !== 'undefined') {
    (window as any).d = { global: globalObj };
    (window as any).global = globalThis;
    (window as any).process = globalObj.process;
    (window as any).Buffer = globalObj.Buffer;
    (window as any).setImmediate = globalObj.setImmediate;
    (window as any).clearImmediate = globalObj.clearImmediate;
  }

  // Apply to self
  if (typeof self !== 'undefined') {
    (self as any).d = { global: globalObj };
    (self as any).global = globalThis;
    (self as any).process = globalObj.process;
    (self as any).Buffer = globalObj.Buffer;
    (self as any).setImmediate = globalObj.setImmediate;
    (self as any).clearImmediate = globalObj.clearImmediate;
  }

  return globalObj;
};

createGlobalPolyfills();

console.log('🔧 [POLYFILLS] Global polyfills created');
console.log('🔧 [POLYFILLS] d.global exists:', typeof (globalThis as any).d?.global !== 'undefined');
console.log('🔧 [POLYFILLS] global exists:', typeof (globalThis as any).global !== 'undefined');
console.log('🔧 [POLYFILLS] process exists:', typeof (globalThis as any).process !== 'undefined');
console.log('🔧 [POLYFILLS] Buffer exists:', typeof (globalThis as any).Buffer !== 'undefined');