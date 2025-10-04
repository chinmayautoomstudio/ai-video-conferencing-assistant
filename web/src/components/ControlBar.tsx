import { useState, useEffect } from 'react'
import { useMeetingStore } from '../stores/meetingStore'
import { WebRTCManager } from '../utils/webrtc'
import { cn } from '../utils/cn'
import AudioLevelIndicator from './AudioLevelIndicator'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Monitor, 
  MonitorOff,
  MessageSquare,
  Users,
  Settings,
  MoreVertical,
  Share,
  Circle,
  Square
} from 'lucide-react'

interface ControlBarProps {
  onLeaveMeeting: () => void
  webrtcManager: WebRTCManager | null
  onVideoToggle?: (enabled: boolean) => void
  onAudioToggle?: (enabled: boolean) => void
  onSendMessage?: (message: string) => void
  currentUserId?: string
}

export default function ControlBar({ 
  onLeaveMeeting, 
  webrtcManager, 
  onVideoToggle, 
  onAudioToggle,
  currentUserId
}: ControlBarProps) {
  const {
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    isRecording,
    isChatOpen,
    isParticipantsOpen,
    currentUser,
    participants,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    toggleChat,
    toggleParticipants,
    toggleRecording
  } = useMeetingStore()

  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [meetingTime, setMeetingTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleVideo = async () => {
    const newVideoState = !isVideoEnabled
    toggleVideo()
    
    // Update WebRTC
    if (webrtcManager) {
      await webrtcManager.toggleVideo(newVideoState)
    }
    
    // Update Supabase
    if (onVideoToggle) {
      onVideoToggle(newVideoState)
    }
  }

  const handleToggleAudio = async () => {
    const newAudioState = !isAudioEnabled
    toggleAudio()
    
    // Update WebRTC
    if (webrtcManager) {
      await webrtcManager.toggleAudio(newAudioState)
    }
    
    // Update Supabase
    if (onAudioToggle) {
      onAudioToggle(newAudioState)
    }
  }

  const handleToggleScreenShare = async () => {
    if (webrtcManager) {
      if (!isScreenSharing) {
        try {
          await webrtcManager.startScreenShare()
          toggleScreenShare()
        } catch (error) {
          console.error('Failed to start screen share:', error)
        }
      } else {
        await webrtcManager.stopScreenShare()
        toggleScreenShare()
      }
    }
  }

  return (
    <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
      {/* Left Side - Meeting Info */}
      <div className="flex items-center space-x-4">
        <div className="text-white text-sm">
          {formatTime(meetingTime)}
        </div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-white text-sm">Connected</span>
        
        {/* Audio Level Indicator */}
        {currentUser && (
          <div className="hidden lg:block">
            <AudioLevelIndicator 
              stream={participants.find(p => p.id === currentUserId)?.stream || null} 
              isAudioEnabled={isAudioEnabled}
              className="text-white"
            />
          </div>
        )}
      </div>

      {/* Center - Main Controls */}
      <div className="flex items-center space-x-2">
        {/* Audio Toggle */}
        <button
          onClick={handleToggleAudio}
          className={cn(
            "control-button",
            !isAudioEnabled && "danger",
            isAudioEnabled && "animate-pulse-slow"
          )}
          title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={handleToggleVideo}
          className={cn(
            "control-button",
            !isVideoEnabled && "danger"
          )}
          title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
        >
          {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={handleToggleScreenShare}
          className={cn(
            "control-button",
            isScreenSharing && "active"
          )}
          title={isScreenSharing ? "Stop sharing" : "Share screen"}
        >
          {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
        </button>

        {/* Recording */}
        <button
          onClick={toggleRecording}
          className={cn(
            "control-button",
            isRecording && "danger"
          )}
          title={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? <Square className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>

        {/* Leave Meeting */}
        <button
          onClick={onLeaveMeeting}
          className="control-button danger"
          title="Leave meeting"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>

      {/* Right Side - Additional Controls */}
      <div className="flex items-center space-x-2">
        {/* Chat Toggle */}
        <button
          onClick={toggleChat}
          className={cn(
            "control-button",
            isChatOpen && "active"
          )}
          title="Toggle chat"
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {/* Participants Toggle */}
        <button
          onClick={toggleParticipants}
          className={cn(
            "control-button",
            isParticipantsOpen && "active"
          )}
          title="Toggle participants"
        >
          <Users className="w-6 h-6" />
        </button>

        {/* More Options */}
        <div className="relative">
          <button
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="control-button"
            title="More options"
          >
            <MoreVertical className="w-6 h-6" />
          </button>

          {showMoreOptions && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 z-50">
              <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2">
                <Share className="w-4 h-4" />
                <span>Invite people</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Controls Overlay */}
      <div className="lg:hidden fixed bottom-20 left-0 right-0 bg-gray-800 px-4 py-2 flex items-center justify-center space-x-4">
        <button
          onClick={handleToggleAudio}
          className={cn(
            "control-button",
            !isAudioEnabled && "danger"
          )}
        >
          {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        
        <button
          onClick={handleToggleVideo}
          className={cn(
            "control-button",
            !isVideoEnabled && "danger"
          )}
        >
          {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>
        
        <button
          onClick={onLeaveMeeting}
          className="control-button danger"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
