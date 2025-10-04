import { useRef, useEffect } from 'react'
import { cn } from '../utils/cn'

interface VideoPreviewProps {
  stream: MediaStream | null
  isVideoEnabled: boolean
  className?: string
}

export default function VideoPreview({ stream, isVideoEnabled, className }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  if (!isVideoEnabled) {
    return (
      <div className={cn("bg-gray-800 rounded-lg flex items-center justify-center aspect-video", className)}>
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
          <p className="text-sm">Camera Off</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative bg-gray-800 rounded-lg overflow-hidden aspect-video", className)}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        preload="none"
        className="w-full h-full object-cover"
        style={{
          transform: 'scaleX(-1)', // Mirror effect for self-view
          WebkitTransform: 'scaleX(-1)'
        }}
      />
      {!stream && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <p className="text-sm">Loading camera...</p>
          </div>
        </div>
      )}
    </div>
  )
}
