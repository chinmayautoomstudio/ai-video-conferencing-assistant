// Comprehensive polyfills for Supabase and other Node.js libraries in browser environment
// This file must be imported before any Supabase imports

console.log('🔧 [POLYFILLS] Loading polyfills for browser environment...')

// Global polyfill
if (typeof global === 'undefined') {
  console.log('🔧 [POLYFILLS] Adding global polyfill')
  ;(window as any).global = globalThis
  ;(globalThis as any).global = globalThis
  // Also add to self for web workers
  if (typeof self !== 'undefined') {
    ;(self as any).global = globalThis
  }
}

// Process polyfill
if (typeof process === 'undefined') {
  console.log('🔧 [POLYFILLS] Adding process polyfill')
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
    kill: () => {},
    exit: () => {},
    on: () => {},
    off: () => {},
    emit: () => {},
    addListener: () => {},
    removeListener: () => {},
    removeAllListeners: () => {},
    setMaxListeners: () => {},
    getMaxListeners: () => 0,
    listeners: () => [],
    rawListeners: () => [],
    listenerCount: () => 0,
    eventNames: () => [],
    prependListener: () => {},
    prependOnceListener: () => {},
    once: () => {},
    hasOwnProperty: Object.prototype.hasOwnProperty,
    isPrototypeOf: Object.prototype.isPrototypeOf,
    propertyIsEnumerable: Object.prototype.propertyIsEnumerable,
    toString: () => '[object process]',
    valueOf: () => processPolyfill
  }
  
  ;(window as any).process = processPolyfill
  ;(globalThis as any).process = processPolyfill
  if (typeof self !== 'undefined') {
    ;(self as any).process = processPolyfill
  }
}

// Buffer polyfill
if (typeof Buffer === 'undefined') {
  console.log('🔧 [POLYFILLS] Adding Buffer polyfill')
  const bufferPolyfill = {
    isBuffer: () => false,
    from: () => new Uint8Array(),
    alloc: () => new Uint8Array(),
    allocUnsafe: () => new Uint8Array(),
    concat: () => new Uint8Array(),
    compare: () => 0,
    copy: () => 0,
    equals: () => false,
    fill: () => bufferPolyfill,
    indexOf: () => -1,
    lastIndexOf: () => -1,
    readDoubleBE: () => 0,
    readDoubleLE: () => 0,
    readFloatBE: () => 0,
    readFloatLE: () => 0,
    readInt8: () => 0,
    readInt16BE: () => 0,
    readInt16LE: () => 0,
    readInt32BE: () => 0,
    readInt32LE: () => 0,
    readIntBE: () => 0,
    readIntLE: () => 0,
    readUInt8: () => 0,
    readUInt16BE: () => 0,
    readUInt16LE: () => 0,
    readUInt32BE: () => 0,
    readUInt32LE: () => 0,
    readUIntBE: () => 0,
    readUIntLE: () => 0,
    subarray: () => new Uint8Array(),
    swap16: () => bufferPolyfill,
    swap32: () => bufferPolyfill,
    swap64: () => bufferPolyfill,
    toJSON: () => ({ type: 'Buffer', data: [] }),
    toString: () => '',
    write: () => 0,
    writeDoubleBE: () => 0,
    writeDoubleLE: () => 0,
    writeFloatBE: () => 0,
    writeFloatLE: () => 0,
    writeInt8: () => 0,
    writeInt16BE: () => 0,
    writeInt16LE: () => 0,
    writeInt32BE: () => 0,
    writeInt32LE: () => 0,
    writeIntBE: () => 0,
    writeIntLE: () => 0,
    writeUInt8: () => 0,
    writeUInt16BE: () => 0,
    writeUInt16LE: () => 0,
    writeUInt32BE: () => 0,
    writeUInt32LE: () => 0,
    writeUIntBE: () => 0,
    writeUIntLE: () => 0
  }
  
  ;(window as any).Buffer = bufferPolyfill
  ;(globalThis as any).Buffer = bufferPolyfill
  if (typeof self !== 'undefined') {
    ;(self as any).Buffer = bufferPolyfill
  }
}

// Crypto polyfill (if needed)
if (typeof crypto === 'undefined' && typeof window !== 'undefined' && window.crypto) {
  console.log('🔧 [POLYFILLS] Adding crypto polyfill')
  ;(globalThis as any).crypto = window.crypto
}

// Additional Node.js globals that might be needed
if (typeof setImmediate === 'undefined') {
  console.log('🔧 [POLYFILLS] Adding setImmediate polyfill')
  ;(window as any).setImmediate = (fn: Function, ...args: any[]) => setTimeout(fn, 0, ...args)
  ;(globalThis as any).setImmediate = (fn: Function, ...args: any[]) => setTimeout(fn, 0, ...args)
}

if (typeof clearImmediate === 'undefined') {
  console.log('🔧 [POLYFILLS] Adding clearImmediate polyfill')
  ;(window as any).clearImmediate = clearTimeout
  ;(globalThis as any).clearImmediate = clearTimeout
}

console.log('🔧 [POLYFILLS] Polyfills loaded successfully')
console.log('🔧 [POLYFILLS] Global available:', typeof global !== 'undefined')
console.log('🔧 [POLYFILLS] Process available:', typeof process !== 'undefined')
console.log('🔧 [POLYFILLS] Buffer available:', typeof Buffer !== 'undefined')