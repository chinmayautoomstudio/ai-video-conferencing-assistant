import { useRef, useEffect, useState } from 'react'
import { isMobile, getOptimizedVideoConstraints, optimizeVideoElement } from '../utils/mobileOptimization'

export default function CameraTest() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Mobile-optimized camera settings
        const isMobileDevice = isMobile()
        const videoConstraints = getOptimizedVideoConstraints(isMobileDevice)

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: true
        })
        
        setStream(mediaStream)
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          optimizeVideoElement(videoRef.current)
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Camera error:', err)
        setError(err instanceof Error ? err.message : 'Failed to access camera')
        setIsLoading(false)
      }
    }

    initializeCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading camera...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-900 rounded-lg">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-red-200">Camera Error</p>
          <p className="text-red-300 text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-64 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Camera Active</span>
          </div>
          <div className="text-sm">
            {stream?.getVideoTracks()[0]?.getSettings().width}x{stream?.getVideoTracks()[0]?.getSettings().height}
          </div>
        </div>
      </div>
    </div>
  )
}
