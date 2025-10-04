// Mock participants for testing without backend
import { Participant } from '../stores/meetingStore'

export const addMockParticipants = (roomId: string) => {
  // Simulate other participants joining the same room
  const mockParticipants: Participant[] = [
    {
      id: 'mock-user-1',
      name: 'John Doe',
      isVideoEnabled: true,
      isAudioEnabled: true,
      isSpeaking: false,
      isHost: false,
      isMuted: false
    },
    {
      id: 'mock-user-2', 
      name: 'Jane Smith',
      isVideoEnabled: true,
      isAudioEnabled: true,
      isSpeaking: false,
      isHost: false,
      isMuted: false
    },
    {
      id: 'mock-user-3',
      name: 'Mike Johnson',
      isVideoEnabled: false,
      isAudioEnabled: true,
      isSpeaking: true,
      isHost: false,
      isMuted: false
    }
  ]

  // Add mock participants after a delay to simulate joining
  setTimeout(() => {
    mockParticipants.forEach((participant, index) => {
      setTimeout(() => {
        // This would normally be called by the meeting store
        console.log(`Mock participant ${participant.name} joined meeting ${roomId}`)
      }, index * 2000) // Stagger the joins
    })
  }, 3000) // Wait 3 seconds after current user joins

  return mockParticipants
}

export const simulateSpeaking = (participantId: string, isSpeaking: boolean) => {
  // Simulate speaking events
  console.log(`Participant ${participantId} is ${isSpeaking ? 'speaking' : 'not speaking'}`)
}
