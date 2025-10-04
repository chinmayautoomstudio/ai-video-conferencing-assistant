import { supabase, Meeting, Participant, ChatMessage } from '../lib/supabase'

export class MeetingService {
  // Check if Supabase is available
  private static checkSupabase() {
    if (!supabase) {
      console.error('❌ Supabase client is not available')
      throw new Error('❌ Supabase client is not initialized. Please check your Supabase configuration and ensure the client is properly created.')
    }
    
    if (!supabase.from) {
      console.error('❌ Supabase client is not properly initialized')
      throw new Error('❌ Supabase client is not properly initialized. The "from" method is not available.')
    }
  }

  // Create a new meeting
  static async createMeeting(roomId: string, createdBy: string): Promise<Meeting> {
    console.log('🔧 [DEBUG] MeetingService.createMeeting called with:', { roomId, createdBy })
    this.checkSupabase()
    
    // First check if meeting already exists
    const existingMeeting = await this.getMeetingByRoomId(roomId)
    if (existingMeeting) {
      console.log('🔧 [DEBUG] Meeting already exists, returning existing meeting:', existingMeeting)
      return existingMeeting
    }
    
    const meeting: Omit<Meeting, 'id' | 'created_at'> = {
      room_id: roomId,
      created_by: createdBy,
      is_active: true,
      max_participants: 12,
      settings: {
        allow_screen_share: true,
        allow_recording: true,
        require_approval: false
      }
    }

    console.log('🔧 [DEBUG] Inserting meeting data:', meeting)

    const { data, error } = await supabase
      .from('meetings')
      .insert(meeting)
      .select()
      .single()

    if (error) {
      console.error('🔧 [DEBUG] ❌ Error creating meeting:', error)
      // If it's a duplicate key error, try to get the existing meeting
      if (error.code === '23505') { // Unique constraint violation
        console.log('🔧 [DEBUG] Duplicate meeting detected, fetching existing meeting...')
        const existingMeeting = await this.getMeetingByRoomId(roomId)
        if (existingMeeting) {
          console.log('🔧 [DEBUG] ✅ Returning existing meeting:', existingMeeting)
          return existingMeeting
        }
      }
      throw error
    }

    console.log('🔧 [DEBUG] ✅ Meeting created successfully:', data)
    return data
  }

  // Get meeting by room ID
  static async getMeetingByRoomId(roomId: string): Promise<Meeting | null> {
    console.log('🔧 [DEBUG] MeetingService.getMeetingByRoomId called with:', roomId)
    this.checkSupabase()
    
    try {
      // Check if supabase client is properly initialized
      if (!supabase || !supabase.from) {
        console.error('🔧 [DEBUG] ❌ Supabase client not properly initialized')
        return null
      }
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('room_id', roomId)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('🔧 [DEBUG] Meeting not found (PGRST116):', roomId)
          return null // Meeting not found
        }
        console.error('🔧 [DEBUG] ❌ Error getting meeting:', error)
        throw error
      }

      console.log('🔧 [DEBUG] ✅ Meeting found:', data)
      return data
    } catch (error) {
      console.error('🔧 [DEBUG] ❌ Exception getting meeting:', error)
      // If it's a 406 error, it might be a permissions issue
      if (error instanceof Error && error.message && error.message.includes('406')) {
        console.log('🔧 [DEBUG] 406 error - might be permissions issue, returning null')
        return null
      }
      throw error
    }
  }

  // Join meeting as participant
  static async joinMeeting(
    meetingId: string, 
    userId: string, 
    userName: string, 
    isHost: boolean = false
  ): Promise<Participant> {
    console.log('🔧 [DEBUG] MeetingService.joinMeeting called with:', { meetingId, userId, userName, isHost })
    
    // First check if participant already exists
    const existingParticipant = await this.getParticipant(meetingId, userId)
    if (existingParticipant) {
      console.log('🔧 [DEBUG] Participant already exists, updating status:', existingParticipant)
      // Update connection status to connected
      await this.updateParticipantStatus(meetingId, userId, { connection_status: 'connected' })
      return existingParticipant
    }
    
    const participant: Omit<Participant, 'id' | 'joined_at'> = {
      meeting_id: meetingId,
      user_id: userId,
      user_name: userName,
      is_host: isHost,
      is_video_enabled: true,
      is_audio_enabled: true,
      is_speaking: false,
      is_muted: false,
      connection_status: 'connected'
    }

    console.log('🔧 [DEBUG] Inserting participant data:', participant)

    const { data, error } = await supabase
      .from('participants')
      .insert(participant)
      .select()
      .single()

    if (error) {
      console.error('🔧 [DEBUG] ❌ Error joining meeting:', error)
      // If it's a duplicate key error, try to get the existing participant
      if (error.code === '23505') { // Unique constraint violation
        console.log('🔧 [DEBUG] Duplicate participant detected, fetching existing participant...')
        const existingParticipant = await this.getParticipant(meetingId, userId)
        if (existingParticipant) {
          console.log('🔧 [DEBUG] ✅ Returning existing participant:', existingParticipant)
          return existingParticipant
        }
      }
      throw error
    }

    console.log('🔧 [DEBUG] ✅ Participant joined successfully:', data)
    return data
  }

  // Leave meeting
  static async leaveMeeting(meetingId: string, userId: string): Promise<void> {
    console.log('🔧 [DEBUG] MeetingService.leaveMeeting called with:', { meetingId, userId })
    
    // First, try to get the participant to confirm they exist
    const existingParticipant = await this.getParticipant(meetingId, userId)
    if (!existingParticipant) {
      console.log('🔧 [DEBUG] Participant not found, already removed or never existed')
      return
    }
    
    console.log('🔧 [DEBUG] Found participant to remove:', existingParticipant)
    
    const { data, error } = await supabase
      .from('participants')
      .delete()
      .eq('meeting_id', meetingId)
      .eq('user_id', userId)
      .select()

    if (error) {
      console.error('🔧 [DEBUG] ❌ Error leaving meeting:', error)
      throw error
    }

    console.log('🔧 [DEBUG] ✅ Successfully left meeting, deleted participants:', data)
    
    // Verify the participant was actually removed
    const verifyRemoval = await this.getParticipant(meetingId, userId)
    if (verifyRemoval) {
      console.error('🔧 [DEBUG] ❌ Participant still exists after deletion attempt!')
    } else {
      console.log('🔧 [DEBUG] ✅ Participant successfully removed from database')
    }
    
    // Check if meeting should be ended (no participants left)
    await this.checkAndEndMeetingIfEmpty(meetingId)
  }

  // Get a specific participant
  static async getParticipant(meetingId: string, userId: string): Promise<Participant | null> {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('meeting_id', meetingId)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Participant not found
        }
        console.error('Error getting participant:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('🔧 [DEBUG] ❌ Exception getting participant:', error)
      // If it's a 406 error, it might be a permissions issue
      if (error instanceof Error && error.message && error.message.includes('406')) {
        console.log('🔧 [DEBUG] 406 error - might be permissions issue, returning null')
        return null
      }
      throw error
    }
  }

  // Get meeting participants
  static async getMeetingParticipants(meetingId: string): Promise<Participant[]> {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('joined_at', { ascending: true })

    if (error) {
      console.error('Error getting participants:', error)
      throw error
    }

    return data || []
  }

  // Update participant status
  static async updateParticipantStatus(
    meetingId: string,
    userId: string,
    updates: Partial<Participant>
  ): Promise<void> {
    const { error } = await supabase
      .from('participants')
      .update(updates)
      .eq('meeting_id', meetingId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating participant status:', error)
      throw error
    }
  }

  // Send chat message
  static async sendChatMessage(
    meetingId: string,
    userId: string,
    userName: string,
    message: string,
    messageType: 'text' | 'system' = 'text'
  ): Promise<ChatMessage> {
    const chatMessage: Omit<ChatMessage, 'id' | 'created_at'> = {
      meeting_id: meetingId,
      user_id: userId,
      user_name: userName,
      message,
      message_type: messageType
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert(chatMessage)
      .select()
      .single()

    if (error) {
      console.error('Error sending chat message:', error)
      throw error
    }

    return data
  }

  // Get chat messages
  static async getChatMessages(meetingId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error getting chat messages:', error)
      throw error
    }

    return data || []
  }

  // Subscribe to real-time updates
  static subscribeToMeetingUpdates(
    meetingId: string,
    onParticipantUpdate: (participant: Participant) => void,
    onChatMessage: (message: ChatMessage) => void,
    onParticipantLeave: (participant: Participant) => void
  ) {
    // Subscribe to participant changes
    const participantSubscription = supabase
      .channel(`meeting-${meetingId}-participants`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `meeting_id=eq.${meetingId}`
        },
        (payload: any) => {
          console.log('🔧 [DEBUG] Participant real-time update:', payload)
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            if (payload.new) {
              onParticipantUpdate(payload.new as Participant)
            }
          } else if (payload.eventType === 'DELETE') {
            if (payload.old) {
              console.log('🔧 [DEBUG] Participant left via real-time:', payload.old)
              onParticipantLeave(payload.old as Participant)
            }
          }
        }
      )
      .subscribe()

    // Subscribe to chat messages
    const chatSubscription = supabase
      .channel(`meeting-${meetingId}-chat`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `meeting_id=eq.${meetingId}`
        },
        (payload: any) => {
          console.log('New chat message:', payload)
          if (payload.new) {
            onChatMessage(payload.new as ChatMessage)
          }
        }
      )
      .subscribe()

    return {
      participantSubscription,
      chatSubscription,
      unsubscribe: () => {
        participantSubscription.unsubscribe()
        chatSubscription.unsubscribe()
      }
    }
  }

  // End meeting
  static async endMeeting(meetingId: string): Promise<void> {
    console.log('🔧 [DEBUG] MeetingService.endMeeting called with:', meetingId)
    this.checkSupabase()
    
    const { error } = await supabase
      .from('meetings')
      .update({ is_active: false })
      .eq('id', meetingId)

    if (error) {
      console.error('🔧 [DEBUG] ❌ Error ending meeting:', error)
      throw error
    }
    
    console.log('🔧 [DEBUG] ✅ Meeting ended successfully:', meetingId)
  }

  // Check if meeting should be ended (no active participants)
  static async checkAndEndMeetingIfEmpty(meetingId: string): Promise<void> {
    console.log('🔧 [DEBUG] MeetingService.checkAndEndMeetingIfEmpty called with:', meetingId)
    this.checkSupabase()
    
    try {
      // Get all participants for this meeting
      const participants = await this.getMeetingParticipants(meetingId)
      console.log('🔧 [DEBUG] Current participants count:', participants.length)
      
      // If no participants, end the meeting
      if (participants.length === 0) {
        console.log('🔧 [DEBUG] No participants found, ending meeting:', meetingId)
        await this.endMeeting(meetingId)
      } else {
        console.log('🔧 [DEBUG] Meeting still has participants, keeping active:', participants.length)
      }
    } catch (error) {
      console.error('🔧 [DEBUG] ❌ Error checking meeting status:', error)
    }
  }
}
