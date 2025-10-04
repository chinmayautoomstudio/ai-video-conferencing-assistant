import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export interface Notification {
  id: string
  type: 'join' | 'leave'
  userName: string
  timestamp: Date
}

export interface Participant {
  id: string
  name: string
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isSpeaking: boolean
  stream?: MediaStream
  peer?: any
  isHost: boolean
  isMuted: boolean
  avatar?: string
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: Date
  type: 'text' | 'system'
}

export interface MeetingState {
  roomId: string | null
  participants: Participant[]
  currentUser: Participant | null
  isConnected: boolean
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  isScreenSharing: boolean
  chatMessages: ChatMessage[]
  isChatOpen: boolean
  isParticipantsOpen: boolean
  layout: 'grid' | 'speaker'
  isWaitingRoom: boolean
  isRecording: boolean
  notifications: Notification[]
  
  // Actions
  setRoomId: (roomId: string) => void
  addParticipant: (participant: Participant) => void
  removeParticipant: (participantId: string) => void
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void
  setCurrentUser: (user: Participant) => void
  setConnected: (connected: boolean) => void
  toggleVideo: () => void
  toggleAudio: () => void
  toggleScreenShare: () => void
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  toggleChat: () => void
  toggleParticipants: () => void
  setLayout: (layout: 'grid' | 'speaker') => void
  setWaitingRoom: (waiting: boolean) => void
  toggleRecording: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (notificationId: string) => void
  resetMeeting: () => void
}

export const useMeetingStore = create<MeetingState>((set) => ({
  roomId: null,
  participants: [],
  currentUser: null,
  isConnected: false,
  isVideoEnabled: true,
  isAudioEnabled: true,
  isScreenSharing: false,
  chatMessages: [],
  isChatOpen: false,
  isParticipantsOpen: false,
  layout: 'grid',
  isWaitingRoom: false,
  isRecording: false,
  notifications: [],

  setRoomId: (roomId: string) => set({ roomId }),
  
  addParticipant: (participant: Participant) => set((state) => ({
    participants: [...state.participants, participant]
  })),
  
  removeParticipant: (participantId: string) => set((state) => ({
    participants: state.participants.filter(p => p.id !== participantId)
  })),
  
  updateParticipant: (participantId: string, updates: Partial<Participant>) => set((state) => ({
    participants: state.participants.map(p => 
      p.id === participantId ? { ...p, ...updates } : p
    )
  })),
  
  setCurrentUser: (user: Participant) => set({ currentUser: user }),
  
  setConnected: (connected: boolean) => set({ isConnected: connected }),
  
  toggleVideo: () => set((state) => {
    const newVideoState = !state.isVideoEnabled
    if (state.currentUser) {
      state.updateParticipant(state.currentUser.id, { isVideoEnabled: newVideoState })
    }
    return { isVideoEnabled: newVideoState }
  }),
  
  toggleAudio: () => set((state) => {
    const newAudioState = !state.isAudioEnabled
    if (state.currentUser) {
      state.updateParticipant(state.currentUser.id, { isAudioEnabled: newAudioState })
    }
    return { isAudioEnabled: newAudioState }
  }),
  
  toggleScreenShare: () => set((state) => ({ isScreenSharing: !state.isScreenSharing })),
  
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => set((state) => ({
    chatMessages: [...state.chatMessages, {
      ...message,
      id: uuidv4(),
      timestamp: new Date()
    }]
  })),
  
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  
  toggleParticipants: () => set((state) => ({ isParticipantsOpen: !state.isParticipantsOpen })),
  
  setLayout: (layout: 'grid' | 'speaker') => set({ layout }),
  
  setWaitingRoom: (waiting: boolean) => set({ isWaitingRoom: waiting }),
  
  toggleRecording: () => set((state) => ({ isRecording: !state.isRecording })),
  
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => set((state) => ({
    notifications: [...state.notifications, {
      ...notification,
      id: uuidv4(),
      timestamp: new Date()
    }]
  })),
  
  removeNotification: (notificationId: string) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== notificationId)
  })),
  
  resetMeeting: () => set({
    roomId: null,
    participants: [],
    currentUser: null,
    isConnected: false,
    isVideoEnabled: true,
    isAudioEnabled: true,
    isScreenSharing: false,
    chatMessages: [],
    isChatOpen: false,
    isParticipantsOpen: false,
    layout: 'grid',
    isWaitingRoom: false,
    isRecording: false,
    notifications: []
  })
}))
