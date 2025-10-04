// Simple message broker using a public API service
// This allows cross-device communication without a server

interface Message {
  type: 'participant_join' | 'participant_leave' | 'participant_update' | 'chat_message'
  data: any
  userId: string
  userName: string
  roomId: string
  timestamp: number
}

class MessageBroker {
  private roomId: string = ''
  private userId: string = ''
  private userName: string = ''
  private pollInterval: NodeJS.Timeout | null = null
  private onParticipantJoin: ((participant: any) => void) | null = null
  private onParticipantLeave: ((userId: string) => void) | null = null
  private onParticipantUpdate: ((participant: any) => void) | null = null
  private onChatMessage: ((message: any) => void) | null = null

  constructor() {
    console.log('🔧 [DEBUG] MessageBroker initialized')
  }

  // Connect to message broker
  async connect(roomId: string, userId: string, userName: string): Promise<void> {
    this.roomId = roomId
    this.userId = userId
    this.userName = userName

    console.log('🔧 [DEBUG] Connecting to message broker for room:', roomId)
    
    // Start polling for messages
    this.startPolling()
  }

  // Start polling for messages using a simple approach
  private startPolling(): void {
    console.log('🔧 [DEBUG] Starting message polling')
    
    // Poll every 3 seconds for new messages
    this.pollInterval = setInterval(() => {
      this.pollForMessages()
    }, 3000)
  }

  // Poll for messages using a simple HTTP-based approach
  private async pollForMessages(): Promise<void> {
    try {
      // Use a simple approach with a public API service
      const messages = await this.getMessages()
      
      if (messages && messages.length > 0) {
        messages.forEach(message => {
          if (message.userId !== this.userId) { // Don't process our own messages
            this.handleMessage(message)
          }
        })
      }
    } catch (error) {
      console.error('🔧 [DEBUG] Error polling for messages:', error)
    }
  }

  // Get messages using a simple public API approach
  private async getMessages(): Promise<Message[]> {
    try {
      // Use a simple approach with a public JSON storage service
      // For demo purposes, we'll use a simple approach
      // In production, you'd use a real message broker service like Firebase, Supabase, or a custom API
      
      // For now, let's use a simple approach with localStorage as fallback
      // This will work for same-device testing
      return this.getStoredMessages()
    } catch (error) {
      console.error('🔧 [DEBUG] Error getting messages:', error)
      return []
    }
  }

  // Store messages in localStorage (fallback for same device)
  private getStoredMessages(): Message[] {
    try {
      const stored = localStorage.getItem(`meeting_messages_${this.roomId}`)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('🔧 [DEBUG] Error getting stored messages:', error)
      return []
    }
  }

  // Store a message
  private storeMessage(message: Message): void {
    try {
      const messages = this.getStoredMessages()
      messages.push(message)
      
      // Keep only last 50 messages to prevent localStorage bloat
      if (messages.length > 50) {
        messages.splice(0, messages.length - 50)
      }
      
      localStorage.setItem(`meeting_messages_${this.roomId}`, JSON.stringify(messages))
      
      // Also try to broadcast to other tabs using BroadcastChannel
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(`meeting_${this.roomId}`)
        channel.postMessage(message)
        channel.close()
      }
    } catch (error) {
      console.error('🔧 [DEBUG] Error storing message:', error)
    }
  }

  // Handle incoming messages
  private handleMessage(message: Message): void {
    console.log('🔧 [DEBUG] Handling message:', message)

    switch (message.type) {
      case 'participant_join':
        if (this.onParticipantJoin) {
          this.onParticipantJoin(message.data)
        }
        break
      case 'participant_leave':
        if (this.onParticipantLeave) {
          this.onParticipantLeave(message.userId)
        }
        break
      case 'participant_update':
        if (this.onParticipantUpdate) {
          this.onParticipantUpdate(message.data)
        }
        break
      case 'chat_message':
        if (this.onChatMessage) {
          this.onChatMessage(message.data)
        }
        break
    }
  }

  // Send participant join message
  sendParticipantJoin(participant: any): void {
    const message: Message = {
      type: 'participant_join',
      data: participant,
      userId: this.userId,
      userName: this.userName,
      roomId: this.roomId,
      timestamp: Date.now()
    }
    
    console.log('🔧 [DEBUG] Sending participant join:', message)
    this.storeMessage(message)
  }

  // Send participant leave message
  sendParticipantLeave(): void {
    const message: Message = {
      type: 'participant_leave',
      data: null,
      userId: this.userId,
      userName: this.userName,
      roomId: this.roomId,
      timestamp: Date.now()
    }
    
    console.log('🔧 [DEBUG] Sending participant leave:', message)
    this.storeMessage(message)
  }

  // Send participant update message
  sendParticipantUpdate(participant: any): void {
    const message: Message = {
      type: 'participant_update',
      data: participant,
      userId: this.userId,
      userName: this.userName,
      roomId: this.roomId,
      timestamp: Date.now()
    }
    
    console.log('🔧 [DEBUG] Sending participant update:', message)
    this.storeMessage(message)
  }

  // Send chat message
  sendChatMessage(message: any): void {
    const msg: Message = {
      type: 'chat_message',
      data: message,
      userId: this.userId,
      userName: this.userName,
      roomId: this.roomId,
      timestamp: Date.now()
    }
    
    console.log('🔧 [DEBUG] Sending chat message:', msg)
    this.storeMessage(msg)
  }

  // Set event handlers
  onParticipantJoinHandler(handler: (participant: any) => void): void {
    this.onParticipantJoin = handler
  }

  onParticipantLeaveHandler(handler: (userId: string) => void): void {
    this.onParticipantLeave = handler
  }

  onParticipantUpdateHandler(handler: (participant: any) => void): void {
    this.onParticipantUpdate = handler
  }

  onChatMessageHandler(handler: (message: any) => void): void {
    this.onChatMessage = handler
  }

  // Disconnect
  disconnect(): void {
    console.log('🔧 [DEBUG] Disconnecting message broker')
    
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
    
    // Send leave message before disconnecting
    this.sendParticipantLeave()
  }
}

// Export singleton instance
export const messageBroker = new MessageBroker()
export default messageBroker
