import { Participant } from '../stores/meetingStore'
import { cn } from '../utils/cn'
import { Mic, MicOff, Video, VideoOff, Crown, UserMinus } from 'lucide-react'

interface ParticipantsPanelProps {
  participants: Participant[]
}

export default function ParticipantsPanel({ participants }: ParticipantsPanelProps) {
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

  const getParticipantInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleMuteParticipant = (participantId: string) => {
    // In a real app, this would send a signal to mute the participant
    console.log('Mute participant:', participantId)
  }

  const handleRemoveParticipant = (participantId: string) => {
    // In a real app, this would remove the participant from the meeting
    console.log('Remove participant:', participantId)
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Participants ({participants.length})
        </h3>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-4">
        {participants.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p>No participants</p>
          </div>
        ) : (
          <div className="space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
                    getParticipantColor(participant.id)
                  )}>
                    {getParticipantInitials(participant.name)}
                  </div>

                  {/* Participant Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {participant.name}
                      </p>
                      {participant.isHost && (
                        <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      )}
                      {participant.id === 'current-user' && (
                        <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    
                    {/* Status Indicators */}
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={cn(
                        "flex items-center space-x-1 text-xs",
                        participant.isAudioEnabled 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      )}>
                        {participant.isAudioEnabled ? (
                          <Mic className="w-3 h-3" />
                        ) : (
                          <MicOff className="w-3 h-3" />
                        )}
                        <span>{participant.isAudioEnabled ? 'Unmuted' : 'Muted'}</span>
                      </div>
                      
                      <div className={cn(
                        "flex items-center space-x-1 text-xs",
                        participant.isVideoEnabled 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      )}>
                        {participant.isVideoEnabled ? (
                          <Video className="w-3 h-3" />
                        ) : (
                          <VideoOff className="w-3 h-3" />
                        )}
                        <span>{participant.isVideoEnabled ? 'Video On' : 'Video Off'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {participant.id !== 'current-user' && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleMuteParticipant(participant.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title={participant.isAudioEnabled ? "Mute participant" : "Unmute participant"}
                    >
                      {participant.isAudioEnabled ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleRemoveParticipant(participant.id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Remove participant"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>• Click on a participant to see more options</p>
          <p>• Hosts can mute and remove participants</p>
        </div>
      </div>
    </div>
  )
}
