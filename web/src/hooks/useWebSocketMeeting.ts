import { useState, useCallback, useEffect } from 'react'
import { Participant } from '../stores/meetingStore'
import { useMeetingStore } from '../stores/meetingStore'
import { crossDeviceMessageBroker } from '../utils/crossDeviceMessageBroker'

export const useWebSocketMeeting = (roomId: string, userId: string, userName: string, isHost: boolean) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    addParticipant,
    updateParticipant,
    removeParticipant,
    addChatMessage,
    setRoomId
  } = useMeetingStore()

  // Set up WebSocket event handlers
  useEffect(() => {
    console.log('🔧 [DEBUG] Setting up WebSocket event handlers')
    
    // Handle participant joins
    crossDeviceMessageBroker.onParticipantJoinHandler((participant: any) => {
      console.log('🔧 [DEBUG] Participant joined via WebSocket:', participant)
      if (participant.user_id !== userId) { // Don't add ourselves
        const storeParticipant: Participant = {
          id: participant.user_id,
          name: participant.user_name,
          isVideoEnabled: participant.is_video_enabled,
          isAudioEnabled: participant.is_audio_enabled,
          isSpeaking: participant.is_speaking,
          isHost: participant.is_host,
          isMuted: participant.is_muted
        }
        addParticipant(storeParticipant)
      }
    })

    // Handle participant leaves
    crossDeviceMessageBroker.onParticipantLeaveHandler((leftUserId: string) => {
      console.log('🔧 [DEBUG] Participant left via WebSocket:', leftUserId)
      if (leftUserId !== userId) { // Don't remove ourselves
        removeParticipant(leftUserId)
      }
    })

    // Handle participant updates
    crossDeviceMessageBroker.onParticipantUpdateHandler((participant: any) => {
      console.log('🔧 [DEBUG] Participant updated via WebSocket:', participant)
      if (participant.user_id !== userId) { // Don't update ourselves
        updateParticipant(participant.user_id, {
          isVideoEnabled: participant.is_video_enabled,
          isAudioEnabled: participant.is_audio_enabled,
          isSpeaking: participant.is_speaking,
          isMuted: participant.is_muted
        })
      }
    })

    // Handle chat messages
    crossDeviceMessageBroker.onChatMessageHandler((message: any) => {
      console.log('🔧 [DEBUG] Chat message received via WebSocket:', message)
      if (message.user_id !== userId) { // Don't add our own messages
        addChatMessage({
          senderId: message.user_id,
          senderName: message.user_name,
          message: message.message,
          type: message.message_type || 'text'
        })
      }
    })

    return () => {
      console.log('🔧 [DEBUG] Cleaning up WebSocket event handlers')
      crossDeviceMessageBroker.disconnect()
    }
  }, [userId, addParticipant, removeParticipant, updateParticipant, addChatMessage])

  // Initialize meeting
  const initializeMeeting = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔧 [DEBUG] ===== INITIALIZING WEBSOCKET MEETING =====')
      console.log('🔧 [DEBUG] Room ID:', roomId)
      console.log('🔧 [DEBUG] User ID:', userId)
      console.log('🔧 [DEBUG] User Name:', userName)
      console.log('🔧 [DEBUG] Is Host:', isHost)

      // Set room ID in store
      setRoomId(roomId)
      console.log('🔧 [DEBUG] Set room ID in store:', roomId)

      // Connect to message broker for real-time communication
      console.log('🔧 [DEBUG] Connecting to message broker for real-time communication...')
      await crossDeviceMessageBroker.connect(roomId, userId, userName)
      
      // Send participant join message
      crossDeviceMessageBroker.sendParticipantJoin({
        user_id: userId,
        user_name: userName,
        is_host: isHost,
        is_video_enabled: true,
        is_audio_enabled: true,
        is_speaking: false,
        is_muted: false
      })

      setLoading(false)
      console.log('🔧 [DEBUG] ✅ WebSocket meeting initialization complete!')
      console.log('🔧 [DEBUG] ===== END INITIALIZATION =====')

    } catch (error) {
      console.error('🔧 [DEBUG] ❌ Error initializing WebSocket meeting:', error)
      setError(error instanceof Error ? error.message : 'Failed to initialize meeting')
      setLoading(false)
    }
  }, [roomId, userId, userName, isHost, setRoomId])

  // Update participant status
  const updateParticipantStatus = useCallback(async (updates: {
    is_video_enabled?: boolean
    is_audio_enabled?: boolean
    is_speaking?: boolean
    is_muted?: boolean
  }) => {
    console.log('🔧 [DEBUG] Updating participant status:', updates)
    
    // Send update via message broker
    crossDeviceMessageBroker.sendParticipantUpdate({
      user_id: userId,
      user_name: userName,
      is_host: isHost,
      is_video_enabled: updates.is_video_enabled ?? true,
      is_audio_enabled: updates.is_audio_enabled ?? true,
      is_speaking: updates.is_speaking ?? false,
      is_muted: updates.is_muted ?? false
    })
  }, [userId, userName, isHost])

  // Send chat message
  const sendChatMessage = useCallback(async (message: string) => {
    console.log('🔧 [DEBUG] Sending chat message:', message)
    
    // Send message via message broker
    crossDeviceMessageBroker.sendChatMessage({
      user_id: userId,
      user_name: userName,
      message: message,
      message_type: 'text'
    })
  }, [userId, userName])

  // Leave meeting
  const leaveMeeting = useCallback(async () => {
    console.log('🔧 [DEBUG] Leaving WebSocket meeting...')
    
    // Send leave message
    crossDeviceMessageBroker.sendParticipantLeave()
    
    // Disconnect
    crossDeviceMessageBroker.disconnect()
  }, [])

  // Refresh participants (for manual refresh)
  const refreshParticipants = useCallback(() => {
    console.log('🔧 [DEBUG] Manual refresh requested - WebSocket will handle this automatically')
    // WebSocket polling handles this automatically
  }, [])

  // Cleanup
  const cleanup = useCallback(() => {
    console.log('🔧 [DEBUG] Message broker meeting cleanup')
    crossDeviceMessageBroker.disconnect()
  }, [])

  return {
    meeting: null, // No persistent meeting data in WebSocket mode
    participants: [], // Participants are managed by Zustand store
    chatMessages: [], // Chat messages are managed by Zustand store
    loading,
    error,
    initializeMeeting,
    updateParticipantStatus,
    sendChatMessage,
    leaveMeeting,
    refreshParticipants,
    cleanup
  }
}
