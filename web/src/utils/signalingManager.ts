// Simple signaling manager using Supabase real-time
import { supabase } from '../lib/supabase'

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate'
  data: any
  fromUserId: string
  toUserId: string
  roomId: string
  timestamp: number
}

export class SignalingManager {
  private roomId: string
  private userId: string
  private onMessage: (message: SignalingMessage) => void
  private channel: any = null

  constructor(roomId: string, userId: string, onMessage: (message: SignalingMessage) => void) {
    this.roomId = roomId
    this.userId = userId
    this.onMessage = onMessage
    
    console.log('🔧 [DEBUG] SignalingManager initialized for room:', roomId, 'user:', userId)
  }

  async connect() {
    try {
      // Check if Supabase is available
      if (!supabase || !supabase.channel) {
        console.error('🔧 [DEBUG] ❌ Supabase not available for signaling')
        throw new Error('Supabase not available')
      }

      // Create a real-time channel for signaling
      this.channel = supabase.channel(`signaling-${this.roomId}`)
      
      // Listen for signaling messages
      this.channel.on('broadcast', { event: 'signaling' }, (payload: any) => {
        const message = payload.payload as SignalingMessage
        
        // Only process messages intended for this user
        if (message.toUserId === this.userId) {
          console.log('🔧 [DEBUG] Received signaling message:', message)
          this.onMessage(message)
        }
      })
      
      // Subscribe to the channel
      if (this.channel.subscribe) {
        await this.channel.subscribe()
        console.log('🔧 [DEBUG] ✅ Connected to signaling channel')
      } else {
        console.error('🔧 [DEBUG] ❌ Channel subscribe method not available')
        throw new Error('Channel subscribe not available')
      }
      
    } catch (error) {
      console.error('🔧 [DEBUG] ❌ Error connecting to signaling channel:', error)
      throw error
    }
  }

  async sendMessage(type: 'offer' | 'answer' | 'ice-candidate', data: any, toUserId: string) {
    if (!this.channel) {
      console.error('🔧 [DEBUG] ❌ Signaling channel not connected')
      return
    }

    const message: SignalingMessage = {
      type,
      data,
      fromUserId: this.userId,
      toUserId,
      roomId: this.roomId,
      timestamp: Date.now()
    }

    try {
      await this.channel.send({
        type: 'broadcast',
        event: 'signaling',
        payload: message
      })
      console.log('🔧 [DEBUG] ✅ Sent signaling message:', message)
    } catch (error) {
      console.error('🔧 [DEBUG] ❌ Error sending signaling message:', error)
    }
  }

  disconnect() {
    if (this.channel) {
      this.channel.unsubscribe()
      this.channel = null
      console.log('🔧 [DEBUG] Disconnected from signaling channel')
    }
  }
}
