import { useState, useEffect } from 'react'
import { useMeetingStore } from '../stores/meetingStore'
import { Video, Mic, MicOff, VideoOff, Users, Clock, CheckCircle } from 'lucide-react'
import { cn } from '../utils/cn'

interface WaitingRoomProps {
  onAdmit: () => void
}

export default function WaitingRoom({ onAdmit }: WaitingRoomProps) {
  const { currentUser, toggleVideo, toggleAudio, isVideoEnabled, isAudioEnabled } = useMeetingStore()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      onAdmit()
    }
  }, [countdown, onAdmit])

  const handleToggleVideo = () => {
    toggleVideo()
  }

  const handleToggleAudio = () => {
    toggleAudio()
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-600 rounded-full">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Joining Meeting
          </h1>
          <p className="text-gray-400">
            Please wait while we connect you...
          </p>
        </div>

        {/* Video Preview */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
            {isVideoEnabled ? (
              <div className="text-center text-gray-400">
                <Video className="w-16 h-16 mx-auto mb-2" />
                <p>Camera Preview</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <VideoOff className="w-16 h-16 mx-auto mb-2" />
                <p>Camera Off</p>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="text-center">
            <h3 className="text-white font-medium">
              {currentUser?.name || 'Anonymous User'}
            </h3>
            <p className="text-gray-400 text-sm">
              {currentUser?.isHost ? 'Host' : 'Participant'}
            </p>
          </div>

          {/* Media Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleToggleVideo}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200",
                isVideoEnabled 
                  ? "bg-primary-600 hover:bg-primary-700 text-white" 
                  : "bg-gray-600 hover:bg-gray-500 text-gray-300"
              )}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            
            <button
              onClick={handleToggleAudio}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200",
                isAudioEnabled 
                  ? "bg-primary-600 hover:bg-primary-700 text-white" 
                  : "bg-gray-600 hover:bg-gray-500 text-gray-300"
              )}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-medium">Connecting to meeting...</span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Audio and video permissions granted</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>WebRTC connection established</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>Joining meeting room...</span>
            </div>
          </div>
        </div>

        {/* Countdown */}
        {countdown > 0 && (
          <div className="text-center">
            <div className="text-6xl font-bold text-primary-400 mb-2">
              {countdown}
            </div>
            <p className="text-gray-400">
              Starting in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
