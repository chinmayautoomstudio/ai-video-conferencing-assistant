import { useAudioLevel } from '../hooks/useAudioLevel'
import { cn } from '../utils/cn'

interface AudioLevelIndicatorProps {
  stream: MediaStream | null
  isAudioEnabled: boolean
  className?: string
}

export default function AudioLevelIndicator({ 
  stream, 
  isAudioEnabled, 
  className 
}: AudioLevelIndicatorProps) {
  const { audioLevel, isSpeaking } = useAudioLevel(stream)

  if (!isAudioEnabled) {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-xs text-red-500">Muted</span>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Audio Level Bars */}
      <div className="flex items-end space-x-1">
        {[...Array(5)].map((_, i) => {
          const height = Math.max(4, (audioLevel * 20) * (i + 1))
          const isActive = audioLevel > (i + 1) * 0.2
          
          return (
            <div
              key={i}
              className={cn(
                "w-1 rounded-full transition-all duration-150",
                isActive 
                  ? isSpeaking 
                    ? "bg-green-400" 
                    : "bg-blue-400"
                  : "bg-gray-300 dark:bg-gray-600"
              )}
              style={{ height: `${height}px` }}
            />
          )
        })}
      </div>
      
      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-500 font-medium">Speaking</span>
        </div>
      )}
      
      {/* Audio Level Percentage */}
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {Math.round(audioLevel * 100)}%
      </span>
    </div>
  )
}
