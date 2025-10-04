import { useRef, useEffect } from 'react'
import { Participant } from '../stores/meetingStore'
import { cn } from '../utils/cn'
import { Mic, MicOff, Video, VideoOff, Crown } from 'lucide-react'
import AudioLevelIndicator from './AudioLevelIndicator'

interface VideoGridProps {
  participants: Participant[]
  currentUserId?: string
}

export default function VideoGrid({ participants, currentUserId }: VideoGridProps) {
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

  useEffect(() => {
    participants.forEach(participant => {
      const videoElement = videoRefs.current[participant.id]
      if (videoElement && participant.stream) {
        console.log('Setting video stream for participant:', participant.id, participant.stream)
        videoElement.srcObject = participant.stream
        
        // Ensure video plays
        videoElement.play().catch(error => {
          console.error('Error playing video:', error)
        })
      } else {
        console.log('No video element or stream for participant:', participant.id, {
          hasElement: !!videoElement,
          hasStream: !!participant.stream
        })
      }
    })
  }, [participants])

  const getGridClass = (count: number) => {
    if (count <= 1) return 'video-grid-1'
    if (count <= 2) return 'video-grid-2'
    if (count <= 4) return 'video-grid-4'
    if (count <= 6) return 'video-grid-6'
    if (count <= 9) return 'video-grid-9'
    return 'video-grid-12'
  }

  const getParticipantInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getParticipantColor = (id: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
      'bg-lime-500',
      'bg-rose-500'
    ]
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  if (participants.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No participants in the meeting</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`video-grid ${getGridClass(participants.length)} p-4 h-full`}>
      {participants.map((participant) => (
        <div key={participant.id} className="video-tile group relative">
          {/* Video Element */}
          <video
            ref={el => videoRefs.current[participant.id] = el}
            autoPlay
            playsInline
            muted={participant.id === currentUserId}
            preload="none"
            className="w-full h-full object-cover"
            style={participant.id === currentUserId ? {
              transform: 'scaleX(-1)', // Mirror effect for self-view
              WebkitTransform: 'scaleX(-1)'
            } : {}}
          />

          {/* Video Off Placeholder */}
          {!participant.isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold",
                getParticipantColor(participant.id)
              )}>
                {getParticipantInitials(participant.name)}
              </div>
            </div>
          )}

          {/* Participant Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium truncate">
                  {participant.name}
                  {participant.isHost && (
                    <Crown className="w-4 h-4 inline ml-1 text-yellow-400" />
                  )}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                {/* Audio Status */}
                <div className={cn(
                  "p-1 rounded-full",
                  participant.isAudioEnabled 
                    ? "bg-green-600" 
                    : "bg-red-600"
                )}>
                  {participant.isAudioEnabled ? (
                    <Mic className="w-3 h-3 text-white" />
                  ) : (
                    <MicOff className="w-3 h-3 text-white" />
                  )}
                </div>

                {/* Video Status */}
                <div className={cn(
                  "p-1 rounded-full",
                  participant.isVideoEnabled 
                    ? "bg-green-600" 
                    : "bg-red-600"
                )}>
                  {participant.isVideoEnabled ? (
                    <Video className="w-3 h-3 text-white" />
                  ) : (
                    <VideoOff className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Audio Level Indicator */}
            {participant.id === 'current-user' && (
              <div className="mt-2">
                <AudioLevelIndicator 
                  stream={participant.stream || null} 
                  isAudioEnabled={participant.isAudioEnabled}
                  className="text-white"
                />
              </div>
            )}
          </div>

          {/* Speaking Indicator */}
          {participant.isSpeaking && (
            <div className="absolute inset-0 border-4 border-green-400 rounded-lg pointer-events-none animate-pulse" />
          )}

          {/* Connection Quality Indicator */}
          <div className="absolute top-2 right-2 flex space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>

          {/* You Indicator */}
          {participant.id === 'current-user' && (
            <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              You
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
