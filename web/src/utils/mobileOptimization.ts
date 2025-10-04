// Mobile performance optimization utilities

export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768
}

export const getOptimizedVideoConstraints = (isMobileDevice: boolean = isMobile()) => {
  if (isMobileDevice) {
    return {
      width: { ideal: 640, max: 1280 },
      height: { ideal: 480, max: 720 },
      frameRate: { ideal: 15, max: 30 },
      facingMode: 'user'
    }
  }
  
  return {
    width: { ideal: 1280, max: 1920 },
    height: { ideal: 720, max: 1080 },
    frameRate: { ideal: 30, max: 60 }
  }
}

export const getOptimizedAudioConstraints = (isMobileDevice: boolean = isMobile()) => {
  if (isMobileDevice) {
    return {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 16000,
      channelCount: 1
    }
  }
  
  return {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 44100,
    channelCount: 2
  }
}

export const optimizeVideoElement = (videoElement: HTMLVideoElement) => {
  if (isMobile()) {
    // Mobile optimizations
    videoElement.setAttribute('preload', 'none')
    videoElement.setAttribute('playsinline', 'true')
    videoElement.style.willChange = 'transform'
    videoElement.style.backfaceVisibility = 'hidden'
    videoElement.style.webkitBackfaceVisibility = 'hidden'
    videoElement.style.transform = 'translateZ(0)'
    videoElement.style.webkitTransform = 'translateZ(0)'
  }
}

export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean
  return function executedFunction(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
