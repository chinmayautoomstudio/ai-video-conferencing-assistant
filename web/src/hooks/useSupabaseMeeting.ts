import { useState, useCallback } from 'react'
import { MeetingService } from '../services/meetingService'
import { Meeting, Participant, ChatMessage } from '../lib/supabase'
import { useMeetingStore } from '../stores/meetingStore'

export const useSupabaseMeeting = (roomId: string, userId: string, userName: string, isHost: boolean) => {
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    addParticipant,
    updateParticipant,
    removeParticipant,
    addChatMessage,
    setRoomId
  } = useMeetingStore()

  // Initialize meeting
  const initializeMeeting = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔧 [DEBUG] ===== INITIALIZING SUPABASE MEETING =====')
      console.log('🔧 [DEBUG] Room ID:', roomId)
      console.log('🔧 [DEBUG] User ID:', userId)
      console.log('🔧 [DEBUG] User Name:', userName)
      console.log('🔧 [DEBUG] Is Host:', isHost)

      // Set room ID in store
      setRoomId(roomId)
      console.log('🔧 [DEBUG] Set room ID in store:', roomId)

      let currentMeeting: Meeting | null = null

      if (isHost) {
        console.log('🔧 [DEBUG] User is HOST - Creating new meeting...')
        try {
          // Create new meeting
          currentMeeting = await MeetingService.createMeeting(roomId, userId)
          console.log('🔧 [DEBUG] Created new meeting:', currentMeeting)
        } catch (error) {
          console.log('🔧 [DEBUG] Error creating meeting, trying to get existing:', error)
          // If creation fails, try to get existing meeting
          currentMeeting = await MeetingService.getMeetingByRoomId(roomId)
          if (!currentMeeting) {
            throw error // Re-throw original error if no existing meeting found
          }
          console.log('🔧 [DEBUG] ✅ Found existing meeting instead:', currentMeeting)
        }
      } else {
        console.log('🔧 [DEBUG] User is PARTICIPANT - Looking for existing meeting...')
        // Join existing meeting
        currentMeeting = await MeetingService.getMeetingByRoomId(roomId)
        console.log('🔧 [DEBUG] Meeting lookup result:', currentMeeting)
        if (!currentMeeting) {
          console.log('🔧 [DEBUG] ❌ Meeting not found!')
          throw new Error('Meeting not found. Please check the Meeting ID.')
        }
        console.log('🔧 [DEBUG] ✅ Found existing meeting:', currentMeeting)
      }

      setMeeting(currentMeeting)
      console.log('🔧 [DEBUG] Set meeting in state:', currentMeeting)

      // Join as participant (this will handle existing participants properly)
      console.log('🔧 [DEBUG] Joining meeting as participant...')
      const participant = await MeetingService.joinMeeting(
        currentMeeting.id,
        userId,
        userName,
        isHost
      )
      console.log('🔧 [DEBUG] ✅ Joined meeting as participant:', participant)
      
      // Check if this is a reconnection (existing participant)
      if (participant.joined_at !== new Date().toISOString()) {
        console.log('🔧 [DEBUG] This is a reconnection for existing participant')
      }

      // Get existing participants
      console.log('🔧 [DEBUG] Loading existing participants...')
      const existingParticipants = await MeetingService.getMeetingParticipants(currentMeeting.id)
      console.log('🔧 [DEBUG] Existing participants:', existingParticipants)
      setParticipants(existingParticipants)

      // Get existing chat messages
      console.log('🔧 [DEBUG] Loading existing chat messages...')
      const existingMessages = await MeetingService.getChatMessages(currentMeeting.id)
      console.log('🔧 [DEBUG] Existing chat messages:', existingMessages)
      setChatMessages(existingMessages)

      // Subscribe to real-time updates
      console.log('🔧 [DEBUG] Setting up real-time subscriptions...')
      const subscription = MeetingService.subscribeToMeetingUpdates(
        currentMeeting.id,
        (updatedParticipant) => {
          console.log('🔧 [DEBUG] 📡 Real-time participant update received:', updatedParticipant)
          
          // Update local state
          setParticipants(prev => {
            const existing = prev.find(p => p.user_id === updatedParticipant.user_id)
            if (existing) {
              return prev.map(p => 
                p.user_id === updatedParticipant.user_id ? updatedParticipant : p
              )
            } else {
              return [...prev, updatedParticipant]
            }
          })

          // Update Zustand store
          if (updatedParticipant.user_id === userId) {
            // Update current user
            updateParticipant('current-user', {
              isVideoEnabled: updatedParticipant.is_video_enabled,
              isAudioEnabled: updatedParticipant.is_audio_enabled,
              isSpeaking: updatedParticipant.is_speaking,
              isMuted: updatedParticipant.is_muted
            })
          } else {
            // Update other participants
            const existingParticipant = participants.find(p => p.user_id === updatedParticipant.user_id)
            if (existingParticipant) {
              updateParticipant(existingParticipant.id, {
                isVideoEnabled: updatedParticipant.is_video_enabled,
                isAudioEnabled: updatedParticipant.is_audio_enabled,
                isSpeaking: updatedParticipant.is_speaking,
                isMuted: updatedParticipant.is_muted
              })
            } else {
              // Add new participant
              addParticipant({
                id: updatedParticipant.user_id,
                name: updatedParticipant.user_name,
                isVideoEnabled: updatedParticipant.is_video_enabled,
                isAudioEnabled: updatedParticipant.is_audio_enabled,
                isSpeaking: updatedParticipant.is_speaking,
                isHost: updatedParticipant.is_host,
                isMuted: updatedParticipant.is_muted
              })
            }
          }
        },
        (newMessage) => {
          console.log('🔧 [DEBUG] 📡 Real-time chat message received:', newMessage)
          
          // Update local state
          setChatMessages(prev => [...prev, newMessage])
          
          // Update Zustand store
          addChatMessage({
            senderId: newMessage.user_id,
            senderName: newMessage.user_name,
            message: newMessage.message,
            type: newMessage.message_type as 'text' | 'system'
          })
        },
        (leftParticipant) => {
          console.log('🔧 [DEBUG] 📡 Real-time participant left received:', leftParticipant)
          
          // Remove from local state
          setParticipants(prev => prev.filter(p => p.user_id !== leftParticipant.user_id))
          
          // Remove from Zustand store
          if (leftParticipant.user_id !== userId) {
            removeParticipant(leftParticipant.user_id)
          }
        }
      )

      setLoading(false)
      console.log('🔧 [DEBUG] ✅ Meeting initialization complete!')
      console.log('🔧 [DEBUG] ===== END INITIALIZATION =====')

      // Set up polling as fallback for real-time updates
      let lastParticipantIds = new Set(existingParticipants.map(p => p.user_id))
      const pollInterval = setInterval(async () => {
        try {
          console.log('🔧 [DEBUG] Polling for participant updates...')
          const updatedParticipants = await MeetingService.getMeetingParticipants(currentMeeting.id)
          console.log('🔧 [DEBUG] Polled participants:', updatedParticipants)
          console.log('🔧 [DEBUG] Polled participant count:', updatedParticipants.length)
          
          // Check for changes in participant list (not just count)
          const currentParticipantIds = new Set(updatedParticipants.map(p => p.user_id))
          
          // Check if participants have changed
          const hasChanges = 
            currentParticipantIds.size !== lastParticipantIds.size ||
            [...currentParticipantIds].some(id => !lastParticipantIds.has(id)) ||
            [...lastParticipantIds].some(id => !currentParticipantIds.has(id))
          
          if (hasChanges) {
            console.log('🔧 [DEBUG] ✅ Participant list changed:')
            console.log('🔧 [DEBUG] Previous IDs:', [...lastParticipantIds])
            console.log('🔧 [DEBUG] Current IDs:', [...currentParticipantIds])
            console.log('🔧 [DEBUG] Previous count:', lastParticipantIds.size)
            console.log('🔧 [DEBUG] Current count:', currentParticipantIds.size)
            
            // Find removed participants
            const removedParticipants = [...lastParticipantIds].filter(id => !currentParticipantIds.has(id))
            if (removedParticipants.length > 0) {
              console.log('🔧 [DEBUG] 🚪 Participants removed:', removedParticipants)
            }
            
            // Find added participants
            const addedParticipants = [...currentParticipantIds].filter(id => !lastParticipantIds.has(id))
            if (addedParticipants.length > 0) {
              console.log('🔧 [DEBUG] 👋 Participants added:', addedParticipants)
            }
            
            setParticipants(updatedParticipants)
            lastParticipantIds = currentParticipantIds
          } else {
            console.log('🔧 [DEBUG] No participant changes detected (count:', currentParticipantIds.size, ')')
          }
        } catch (error) {
          console.error('🔧 [DEBUG] Error polling participants:', error)
        }
      }, 2000) // Poll every 2 seconds

      // Cleanup function
      return () => {
        console.log('🔧 [DEBUG] Cleaning up meeting subscription and polling')
        if (subscription) {
          subscription.unsubscribe()
        }
        clearInterval(pollInterval)
      }

    } catch (error) {
      console.error('🔧 [DEBUG] ❌ Error initializing meeting:', error)
      setError(error instanceof Error ? error.message : 'Failed to initialize meeting')
      setLoading(false)
    }
  }, [roomId, userId, userName, isHost, setRoomId, addParticipant, updateParticipant, addChatMessage])

  // Update participant status
  const updateParticipantStatus = useCallback(async (updates: {
    is_video_enabled?: boolean
    is_audio_enabled?: boolean
    is_speaking?: boolean
    is_muted?: boolean
  }) => {
    if (!meeting) return

    console.log('🔧 [DEBUG] Updating participant status:', updates)
    
    try {
      await MeetingService.updateParticipantStatus(meeting.id, userId, updates)
      console.log('🔧 [DEBUG] ✅ Participant status updated successfully')
    } catch (error) {
      console.error('🔧 [DEBUG] ❌ Error updating participant status:', error)
    }
  }, [meeting, userId])

  // Send chat message
  const sendChatMessage = useCallback(async (message: string) => {
    if (!meeting) return

    console.log('🔧 [DEBUG] Sending chat message:', message)
    
    try {
      await MeetingService.sendChatMessage(meeting.id, userId, userName, message)
      console.log('🔧 [DEBUG] ✅ Chat message sent successfully')
    } catch (error) {
      console.error('🔧 [DEBUG] ❌ Error sending chat message:', error)
    }
  }, [meeting, userId, userName])

  // Leave meeting
  const leaveMeeting = useCallback(async () => {
    if (!meeting) return

    console.log('🔧 [DEBUG] Leaving meeting...')
    
    try {
      await MeetingService.leaveMeeting(meeting.id, userId)
      console.log('🔧 [DEBUG] ✅ Successfully left meeting')
    } catch (error) {
      console.error('🔧 [DEBUG] ❌ Error leaving meeting:', error)
    }
  }, [meeting, userId])

  // End meeting (for host)
  const endMeeting = useCallback(async () => {
    if (!meeting) return

    console.log('🔧 [DEBUG] Ending meeting...')
    
    try {
      await MeetingService.endMeeting(meeting.id)
      console.log('🔧 [DEBUG] ✅ Successfully ended meeting')
    } catch (error) {
      console.error('🔧 [DEBUG] ❌ Error ending meeting:', error)
    }
  }, [meeting])

  // Refresh participants (for manual refresh)
  const refreshParticipants = useCallback(async () => {
    if (!meeting) return

    console.log('🔧 [DEBUG] Manual refresh requested')
    
    try {
      const updatedParticipants = await MeetingService.getMeetingParticipants(meeting.id)
      console.log('🔧 [DEBUG] Refreshed participants:', updatedParticipants)
      setParticipants(updatedParticipants)
    } catch (error) {
      console.error('🔧 [DEBUG] Error refreshing participants:', error)
    }
  }, [meeting])

  // Cleanup
  const cleanup = useCallback(() => {
    console.log('🔧 [DEBUG] Supabase meeting cleanup')
    // Cleanup is handled by the subscription cleanup function
  }, [])

  return {
    meeting,
    participants,
    chatMessages,
    loading,
    error,
    initializeMeeting,
    updateParticipantStatus,
    sendChatMessage,
    leaveMeeting,
    endMeeting,
    refreshParticipants,
    cleanup
  }
}
