import { useState } from 'react'
import { useMeetingStore } from '../stores/meetingStore'
import VideoPreview from './VideoPreview'
import AudioLevelIndicator from './AudioLevelIndicator'
import { cn } from '../utils/cn'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare,
  Users,
  Copy,
  Check
} from 'lucide-react'

interface MobileMeetingInterfaceProps {
  onLeaveMeeting: () => void
  webrtcManager: any
  onVideoToggle?: (enabled: boolean) => void
  onAudioToggle?: (enabled: boolean) => void
  onSendMessage?: (message: string) => void
  currentUserId?: string
}

export default function MobileMeetingInterface({ 
  onLeaveMeeting, 
  webrtcManager, 
  onVideoToggle, 
  onAudioToggle,
  currentUserId
}: MobileMeetingInterfaceProps) {
  const {
    participants,
    roomId,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio
  } = useMeetingStore()

  const [activeTab, setActiveTab] = useState<'video' | 'chat' | 'participants'>('video')
  const [copied, setCopied] = useState(false)

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

  const copyMeetingId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">Connected</span>
          </div>
          <div className="text-white text-sm">
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-300 text-xs">Meeting ID:</span>
            <span className="text-white font-mono font-semibold text-xs">{roomId}</span>
          </div>
          <button
            onClick={copyMeetingId}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Copy Meeting ID"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Area */}
        {activeTab === 'video' && (
          <div className="flex-1 p-4">
            <div className="h-full flex flex-col">
              {/* Your Video */}
              <div className="mb-4">
                <VideoPreview 
                  stream={participants.find(p => p.id === currentUserId)?.stream || null}
                  isVideoEnabled={isVideoEnabled}
                  className="w-full"
                />
                {participants.find(p => p.id === currentUserId) && (
                  <div className="mt-2">
                    <AudioLevelIndicator 
                      stream={participants.find(p => p.id === currentUserId)?.stream || null}
                      isAudioEnabled={isAudioEnabled}
                      className="text-white"
                    />
                  </div>
                )}
              </div>

              {/* Other Participants */}
              <div className="flex-1 grid grid-cols-2 gap-2">
                {participants
                  .filter(p => p.id !== currentUserId)
                  .slice(0, 4)
                  .map((participant) => (
                    <div key={participant.id} className="relative">
                      <VideoPreview 
                        stream={participant.stream || null}
                        isVideoEnabled={participant.isVideoEnabled}
                        className="w-full h-32"
                      />
                      <div className="absolute bottom-1 left-1 right-1 bg-black/50 rounded px-2 py-1">
                        <p className="text-white text-xs truncate">{participant.name}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex-1 p-4 bg-white dark:bg-gray-800">
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Chat</h3>
              <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Chat functionality will be implemented here
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Participants Tab */}
        {activeTab === 'participants' && (
          <div className="flex-1 p-4 bg-white dark:bg-gray-800">
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Participants ({participants.length})
              </h3>
              <div className="flex-1 space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium">{participant.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          participant.isAudioEnabled ? "bg-green-400" : "bg-red-400"
                        )}></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {participant.isAudioEnabled ? 'Unmuted' : 'Muted'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-800 p-4">
        {/* Tab Navigation */}
        <div className="flex justify-center space-x-8 mb-4">
          <button
            onClick={() => setActiveTab('video')}
            className={cn(
              "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors",
              activeTab === 'video' 
                ? "text-primary-400 bg-primary-900/20" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <Video className="w-6 h-6" />
            <span className="text-xs">Video</span>
          </button>
          
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors",
              activeTab === 'chat' 
                ? "text-primary-400 bg-primary-900/20" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs">Chat</span>
          </button>
          
          <button
            onClick={() => setActiveTab('participants')}
            className={cn(
              "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors",
              activeTab === 'participants' 
                ? "text-primary-400 bg-primary-900/20" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs">People</span>
          </button>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleToggleAudio}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              isAudioEnabled 
                ? "bg-gray-600 hover:bg-gray-500 text-white" 
                : "bg-red-600 hover:bg-red-700 text-white"
            )}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          <button
            onClick={handleToggleVideo}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              isVideoEnabled 
                ? "bg-gray-600 hover:bg-gray-500 text-white" 
                : "bg-red-600 hover:bg-red-700 text-white"
            )}
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          <button
            onClick={onLeaveMeeting}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
