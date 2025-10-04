// Simple WebSocket manager for real-time communication
// This replaces Supabase real-time functionality

interface WebSocketMessage {
  type: 'participant_join' | 'participant_leave' | 'participant_update' | 'chat_message'
  data: any
  userId: string
  userName: string
  roomId: string
  timestamp: number
}

class WebSocketManager {
  private ws: WebSocket | null = null
  private roomId: string = ''
  private userId: string = ''
  private userName: string = ''
  private onParticipantJoin: ((participant: any) => void) | null = null
  private onParticipantLeave: ((userId: string) => void) | null = null
  private onParticipantUpdate: ((participant: any) => void) | null = null
  private onChatMessage: ((message: any) => void) | null = null

  constructor() {
    console.log('🔧 [DEBUG] WebSocketManager initialized')
  }

  // Connect to WebSocket server
  async connect(roomId: string, userId: string, userName: string): Promise<void> {
    this.roomId = roomId
    this.userId = userId
    this.userName = userName

    try {
      // For now, we'll use a simple polling mechanism instead of WebSocket
      // This avoids the need for a WebSocket server
      console.log('🔧 [DEBUG] Starting polling-based real-time sync for room:', roomId)
      this.startPolling()
    } catch (error) {
      console.error('🔧 [DEBUG] Failed to connect to real-time service:', error)
      throw error
    }
  }

  // Start polling for updates (fallback when WebSocket is not available)
  private startPolling(): void {
    console.log('🔧 [DEBUG] Starting polling mechanism')
    
    // Poll every 2 seconds for participant updates
    setInterval(() => {
      this.pollForUpdates()
    }, 2000)
  }

  // Poll for updates from other participants
  private async pollForUpdates(): Promise<void> {
    try {
      // In a real implementation, this would poll a server
      // For now, we'll use localStorage as a simple shared state
      const updates = this.getStoredUpdates()
      
      if (updates && updates.length > 0) {
        updates.forEach(update => {
          if (update.userId !== this.userId) { // Don't process our own updates
            this.handleMessage(update)
          }
        })
        
        // Clear processed updates
        this.clearStoredUpdates()
      }
    } catch (error) {
      console.error('🔧 [DEBUG] Error polling for updates:', error)
    }
  }

  // Store updates in localStorage (simple shared state)
  private storeUpdate(message: WebSocketMessage): void {
    try {
      const updates = this.getStoredUpdates()
      updates.push(message)
      
      // Keep only last 10 updates to prevent localStorage bloat
      if (updates.length > 10) {
        updates.splice(0, updates.length - 10)
      }
      
      localStorage.setItem(`meeting_updates_${this.roomId}`, JSON.stringify(updates))
    } catch (error) {
      console.error('🔧 [DEBUG] Error storing update:', error)
    }
  }

  // Get stored updates from localStorage
  private getStoredUpdates(): WebSocketMessage[] {
    try {
      const stored = localStorage.getItem(`meeting_updates_${this.roomId}`)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('🔧 [DEBUG] Error getting stored updates:', error)
      return []
    }
  }

  // Clear stored updates
  private clearStoredUpdates(): void {
    try {
      localStorage.removeItem(`meeting_updates_${this.roomId}`)
    } catch (error) {
      console.error('🔧 [DEBUG] Error clearing stored updates:', error)
    }
  }

  // Handle incoming messages
  private handleMessage(message: WebSocketMessage): void {
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
    const message: WebSocketMessage = {
      type: 'participant_join',
      data: participant,
      userId: this.userId,
      userName: this.userName,
      roomId: this.roomId,
      timestamp: Date.now()
    }
    
    console.log('🔧 [DEBUG] Sending participant join:', message)
    this.storeUpdate(message)
  }

  // Send participant leave message
  sendParticipantLeave(): void {
    const message: WebSocketMessage = {
      type: 'participant_leave',
      data: null,
      userId: this.userId,
      userName: this.userName,
      roomId: this.roomId,
      timestamp: Date.now()
    }
    
    console.log('🔧 [DEBUG] Sending participant leave:', message)
    this.storeUpdate(message)
  }

  // Send participant update message
  sendParticipantUpdate(participant: any): void {
    const message: WebSocketMessage = {
      type: 'participant_update',
      data: participant,
      userId: this.userId,
      userName: this.userName,
      roomId: this.roomId,
      timestamp: Date.now()
    }
    
    console.log('🔧 [DEBUG] Sending participant update:', message)
    this.storeUpdate(message)
  }

  // Send chat message
  sendChatMessage(message: any): void {
    const wsMessage: WebSocketMessage = {
      type: 'chat_message',
      data: message,
      userId: this.userId,
      userName: this.userName,
      roomId: this.roomId,
      timestamp: Date.now()
    }
    
    console.log('🔧 [DEBUG] Sending chat message:', wsMessage)
    this.storeUpdate(wsMessage)
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
    console.log('🔧 [DEBUG] Disconnecting WebSocket manager')
    
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    
    // Send leave message before disconnecting
    this.sendParticipantLeave()
    
    // Clear stored updates
    this.clearStoredUpdates()
  }
}

// Export singleton instance
export const websocketManager = new WebSocketManager()
export default websocketManager
