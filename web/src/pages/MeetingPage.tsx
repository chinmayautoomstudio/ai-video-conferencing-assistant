import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useMeetingStore } from '../stores/meetingStore'
import { RealWebRTCManager } from '../utils/realWebRTC'
import { SignalingManager } from '../utils/signalingManager'
import VideoGrid from '../components/VideoGrid'
import ControlBar from '../components/ControlBar'
import ChatPanel from '../components/ChatPanel'
import ParticipantsPanel from '../components/ParticipantsPanel'
import WaitingRoom from '../components/WaitingRoom'
import MobileMeetingInterface from '../components/MobileMeetingInterface'
import { Participant } from '../stores/meetingStore'
import { Copy, Check, RefreshCw } from 'lucide-react'
import { useSupabaseMeeting } from '../hooks/useSupabaseMeeting'
import NotificationSystem from '../components/NotificationSystem'

export default function MeetingPage() {
  const { roomId: urlRoomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const webrtcManagerRef = useRef<RealWebRTCManager | null>(null)
  const signalingManagerRef = useRef<SignalingManager | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [copied, setCopied] = useState(false)
  const [supabaseInitialized, setSupabaseInitialized] = useState(false)
  const lastProcessedParticipantsRef = useRef<string>('')
  
  const {
    participants,
    currentUser,
    isWaitingRoom,
    isChatOpen,
    isParticipantsOpen,
    roomId,
    notifications,
    setRoomId,
    setCurrentUser,
    addParticipant,
    updateParticipant,
    removeParticipant,
    setConnected,
    setWaitingRoom,
    addNotification,
    removeNotification,
    resetMeeting
  } = useMeetingStore()

  const { userName, isHost, isVideoEnabled, isAudioEnabled } = location.state || {}

  // Generate or retrieve a persistent user ID for this session
  const getOrCreateUserId = () => {
    const sessionKey = `meeting_user_${urlRoomId}`
    let userId = sessionStorage.getItem(sessionKey)
    
    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem(sessionKey, userId)
      console.log('🔧 [DEBUG] Created new user ID:', userId)
    } else {
      console.log('🔧 [DEBUG] Retrieved existing user ID:', userId)
    }
    
    return userId
  }
  
  const userId = getOrCreateUserId()

  // Initialize Supabase meeting
  const {
    meeting,
    participants: supabaseParticipants,
    loading: supabaseLoading,
    error: supabaseError,
    initializeMeeting,
    updateParticipantStatus,
    sendChatMessage,
    leaveMeeting: supabaseLeaveMeeting,
    endMeeting: supabaseEndMeeting,
    refreshParticipants
  } = useSupabaseMeeting(urlRoomId || '', userId, userName || 'Anonymous User', isHost || false)

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                           window.innerWidth <= 768
      setIsMobile(isMobileDevice)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    if (!urlRoomId) {
      navigate('/')
      return
    }

    setRoomId(urlRoomId)
    
    // Initialize current user with the same ID that will be used in Supabase
    const user: Participant = {
      id: userId, // Use the same userId that will be used in Supabase
      name: userName || 'Anonymous User',
      isVideoEnabled: isVideoEnabled ?? true,
      isAudioEnabled: isAudioEnabled ?? true,
      isSpeaking: false,
      isHost: isHost ?? false,
      isMuted: false
    }
    setCurrentUser(user)
    addParticipant(user)

    // Initialize Supabase meeting first
    const initSupabase = async () => {
      try {
        await initializeMeeting()
        setSupabaseInitialized(true)
        // Then initialize WebRTC
        initializeWebRTC()
      } catch (error) {
        console.error('Failed to initialize Supabase meeting:', error)
        // Still initialize WebRTC for local testing
        initializeWebRTC()
      }
    }

    initSupabase()

    // Add beforeunload event listener to ensure cleanup on page unload
    const handleBeforeUnload = () => {
      console.log('🔧 [DEBUG] MeetingPage: Page unloading, performing cleanup...')
      // Use synchronous cleanup for beforeunload
      if (supabaseInitialized && meeting) {
        // If user is host, try to end meeting; otherwise just remove participant
        if (isHost) {
          // Try to end meeting synchronously (this might not work in all browsers)
          fetch(`https://jkonlgbqvqxrazwsptxo.supabase.co/rest/v1/meetings?id=eq.${meeting.id}`, {
            method: 'PATCH',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb25sZ2JxdnF4cmF6d3NwdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTc1MTIsImV4cCI6MjA3NTA3MzUxMn0.rh-bP1FNvhOqIZawoB-r9rBKXTrBi9pjYbWif_qZqnc',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb25sZ2JxdnF4cmF6d3NwdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTc1MTIsImV4cCI6MjA3NTA3MzUxMn0.rh-bP1FNvhOqIZawoB-r9rBKXTrBi9pjYbWif_qZqnc',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_active: false })
          }).catch(err => console.log('End meeting request failed:', err))
        } else {
          // Try to leave meeting synchronously (this might not work in all browsers)
          fetch(`https://jkonlgbqvqxrazwsptxo.supabase.co/rest/v1/participants?meeting_id=eq.${meeting.id}&user_id=eq.${userId}`, {
            method: 'DELETE',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb25sZ2JxdnF4cmF6d3NwdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTc1MTIsImV4cCI6MjA3NTA3MzUxMn0.rh-bP1FNvhOqIZawoB-r9rBKXTrBi9pjYbWif_qZqnc',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb25sZ2JxdnF4cmF6d3NwdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTc1MTIsImV4cCI6MjA3NTA3MzUxMn0.rh-bP1FNvhOqIZawoB-r9rBKXTrBi9pjYbWif_qZqnc'
            }
          }).catch(err => console.log('Leave meeting request failed:', err))
        }
      }
      
      // Clear session storage on page unload
      const sessionKey = `meeting_user_${urlRoomId}`
      sessionStorage.removeItem(sessionKey)
      console.log('🔧 [DEBUG] MeetingPage: Cleared session storage on page unload')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      cleanup()
    }
  }, [urlRoomId, userName, isHost, isVideoEnabled, isAudioEnabled])

  // Sync Supabase participants with local store and detect joins/leaves
  useEffect(() => {
    console.log('🔧 [DEBUG] MeetingPage: Supabase participants changed:', supabaseParticipants)
    
    if (supabaseParticipants && supabaseParticipants.length > 0) {
      // Create a unique key for this participant list to prevent duplicate processing
      const participantsKey = supabaseParticipants.map(p => `${p.user_id}-${p.user_name}`).sort().join('|')
      
      // Skip if we've already processed this exact participant list
      if (lastProcessedParticipantsRef.current === participantsKey) {
        console.log('🔧 [DEBUG] MeetingPage: Skipping duplicate participant list processing')
        return
      }
      
      lastProcessedParticipantsRef.current = participantsKey
      console.log('🔧 [DEBUG] MeetingPage: Syncing Supabase participants:', supabaseParticipants)
      
      // Get current participants from store to avoid infinite loop
      const currentParticipants = useMeetingStore.getState().participants
      
      // Find new participants (joined)
      const newParticipants = supabaseParticipants.filter(
        supabaseParticipant => !currentParticipants.find(p => p.id === supabaseParticipant.user_id)
      )
      
      // Find left participants (left)
      const leftParticipants = currentParticipants.filter(
        currentParticipant => !supabaseParticipants.find(p => p.user_id === currentParticipant.id)
      )
      
      // Add notifications for joins
      newParticipants.forEach(participant => {
        if (participant.user_id !== userId) { // Don't notify for self
          console.log('🔧 [DEBUG] MeetingPage: User joined:', participant.user_name)
          addNotification({
            type: 'join',
            userName: participant.user_name
          })
        }
      })
      
      // Add notifications for leaves
      leftParticipants.forEach(participant => {
        if (participant.id !== userId) { // Don't notify for self
          console.log('🔧 [DEBUG] MeetingPage: User left:', participant.name)
          addNotification({
            type: 'leave',
            userName: participant.name
          })
        }
      })
      
      // Remove left participants from store
      leftParticipants.forEach(participant => {
        console.log('🔧 [DEBUG] MeetingPage: Removing participant:', participant.name)
        removeParticipant(participant.id)
      })
      
      // Clear existing participants and add Supabase ones (avoid duplicates)
      const processedIds = new Set<string>()
      
      supabaseParticipants.forEach(participant => {
        // Skip if we've already processed this participant
        if (processedIds.has(participant.user_id)) {
          console.log('🔧 [DEBUG] MeetingPage: Skipping duplicate participant:', participant.user_id)
          return
        }
        
        processedIds.add(participant.user_id)
        
        const storeParticipant: Participant = {
          id: participant.user_id,
          name: participant.user_name,
          isVideoEnabled: participant.is_video_enabled,
          isAudioEnabled: participant.is_audio_enabled,
          isSpeaking: participant.is_speaking,
          isHost: participant.is_host,
          isMuted: participant.is_muted
        }
        
        console.log('🔧 [DEBUG] MeetingPage: Adding/updating participant:', storeParticipant)
        
        // Check if participant already exists in current store state
        const existingParticipant = currentParticipants.find(p => p.id === participant.user_id)
        if (existingParticipant) {
          // Update existing participant
          updateParticipant(participant.user_id, storeParticipant)
        } else {
        // Add new participant
        addParticipant(storeParticipant)
        
        // Initiate WebRTC connection for new participants
        if (webrtcManagerRef.current && participant.user_id !== userId) {
          console.log('🔧 [DEBUG] Initiating WebRTC connection to new participant:', participant.user_id)
          webrtcManagerRef.current.initiateCall(participant.user_id)
        }
      }
    })
  } else if (supabaseParticipants && supabaseParticipants.length === 0) {
    console.log('🔧 [DEBUG] MeetingPage: No Supabase participants to sync')
    // Reset the processed participants key when list is empty
    lastProcessedParticipantsRef.current = ''
  }
}, [supabaseParticipants, userId, addParticipant, updateParticipant, removeParticipant, addNotification])

  const initializeWebRTC = async () => {
    try {
      // Initialize signaling manager
      signalingManagerRef.current = new SignalingManager(
        urlRoomId || '',
        userId,
        (message) => {
          console.log('🔧 [DEBUG] Received signaling message:', message)
          if (webrtcManagerRef.current) {
            switch (message.type) {
              case 'offer':
                webrtcManagerRef.current.handleIncomingCall(message.fromUserId, message.data)
                break
              case 'answer':
                webrtcManagerRef.current.handleIncomingAnswer(message.fromUserId, message.data)
                break
              case 'ice-candidate':
                webrtcManagerRef.current.handleIncomingIceCandidate(message.fromUserId, message.data)
                break
            }
          }
        }
      )

      try {
        await signalingManagerRef.current.connect()
      } catch (error) {
        console.error('🔧 [DEBUG] Signaling connection failed, continuing with local mode:', error)
        // Continue without signaling for local testing
      }

      // Initialize WebRTC manager
      webrtcManagerRef.current = new RealWebRTCManager(
        signalingManagerRef.current,
        (peerId, stream) => {
          console.log('🔧 [DEBUG] Received remote stream from peer:', peerId)
          updateParticipant(peerId, { stream })
        },
        (peerId) => {
          console.log('🔧 [DEBUG] Peer disconnected:', peerId)
          removeParticipant(peerId)
        }
      )

      // Ensure at least one media type is enabled
      const videoEnabled = isVideoEnabled ?? true
      const audioEnabled = isAudioEnabled ?? true
      
      const localStream = await webrtcManagerRef.current.initializeLocalStream(
        videoEnabled,
        audioEnabled
      )

      console.log('Local stream created:', localStream)
      console.log('Video tracks:', localStream.getVideoTracks())
      console.log('Audio tracks:', localStream.getAudioTracks())

      // Update the current user with the stream
      updateParticipant(userId, { stream: localStream })

      setConnected(true)
      
      // Simulate joining a meeting (in real app, this would connect to signaling server)
      setTimeout(() => {
        setWaitingRoom(false)
      }, 2000)

    } catch (error) {
      console.error('Failed to initialize WebRTC:', error)
      // Handle error - show user-friendly message
      if (error instanceof Error) {
        if (error.message.includes('Permission denied')) {
          alert('Camera and microphone access is required for video conferencing. Please allow access and refresh the page.')
        } else if (error.message.includes('At least one of audio or video must be enabled')) {
          alert('Please enable at least camera or microphone to join the meeting.')
        } else {
          alert('Failed to access camera and microphone. Please check your device permissions.')
        }
      }
    }
  }

  const cleanup = async () => {
    console.log('🔧 [DEBUG] MeetingPage: Starting cleanup process...')
    
    if (webrtcManagerRef.current) {
      webrtcManagerRef.current.cleanup()
    }
    
    if (signalingManagerRef.current) {
      signalingManagerRef.current.disconnect()
    }
    
    // Clean up Supabase meeting
    if (supabaseInitialized) {
      try {
        console.log('🔧 [DEBUG] MeetingPage: Leaving Supabase meeting...')
        
        // If user is host, end the meeting; otherwise just leave
        if (isHost && meeting) {
          console.log('🔧 [DEBUG] MeetingPage: User is host, ending meeting...')
          await supabaseEndMeeting()
          console.log('🔧 [DEBUG] MeetingPage: Successfully ended meeting')
        } else {
          await supabaseLeaveMeeting()
          console.log('🔧 [DEBUG] MeetingPage: Successfully left Supabase meeting')
        }
      } catch (error) {
        console.error('🔧 [DEBUG] MeetingPage: Error leaving/ending Supabase meeting:', error)
      }
    }
    
    // Also remove from local store immediately
    console.log('🔧 [DEBUG] MeetingPage: Removing current user from local store...')
    removeParticipant(userId)
    
    // Clear session storage for this meeting
    const sessionKey = `meeting_user_${urlRoomId}`
    sessionStorage.removeItem(sessionKey)
    console.log('🔧 [DEBUG] MeetingPage: Cleared session storage for user ID')
    
    resetMeeting()
    console.log('🔧 [DEBUG] MeetingPage: Cleanup completed')
  }

  const handleLeaveMeeting = () => {
    if (window.confirm('Are you sure you want to leave the meeting?')) {
      cleanup()
      navigate('/')
    }
  }

  const copyMeetingId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }


  // Sync video/audio changes with Supabase
  const handleVideoToggle = async (enabled: boolean) => {
    if (supabaseInitialized && meeting) {
      try {
        await updateParticipantStatus({
          is_video_enabled: enabled
        })
      } catch (error) {
        console.error('Error updating video status in Supabase:', error)
      }
    }
  }

  const handleAudioToggle = async (enabled: boolean) => {
    if (supabaseInitialized && meeting) {
      try {
        await updateParticipantStatus({
          is_audio_enabled: enabled
        })
      } catch (error) {
        console.error('Error updating audio status in Supabase:', error)
      }
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Initializing meeting...</p>
                {supabaseLoading && <p className="text-sm text-gray-500 mt-2">Connecting to database...</p>}
                {supabaseError && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p className="text-sm">Database Error: {supabaseError}</p>
                    <p className="text-xs mt-1">Continuing with local mode...</p>
                  </div>
                )}
        </div>
      </div>
    )
  }

  if (isWaitingRoom) {
    return <WaitingRoom onAdmit={() => setWaitingRoom(false)} />
  }

  // Use mobile interface for mobile devices
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Notification System */}
        <NotificationSystem 
          notifications={notifications}
          onRemoveNotification={removeNotification}
        />
               <MobileMeetingInterface 
                 onLeaveMeeting={handleLeaveMeeting}
                 webrtcManager={webrtcManagerRef.current as any}
                 onVideoToggle={handleVideoToggle}
                 onAudioToggle={handleAudioToggle}
                 onSendMessage={sendChatMessage}
                 currentUserId={userId}
               />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />
      {/* Meeting Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">Meeting ID:</span>
              <span className="text-white font-mono font-semibold">{roomId}</span>
              <button
                onClick={copyMeetingId}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Copy Meeting ID"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
                 <div className="flex items-center space-x-2">
                   <div className="text-gray-300 text-sm">
                     {participants.length} participant{participants.length !== 1 ? 's' : ''}
                   </div>
                   <button
                     onClick={refreshParticipants}
                     className="p-1 text-gray-400 hover:text-white transition-colors"
                     title="Refresh Participants"
                   >
                     <RefreshCw className="w-4 h-4" />
                   </button>
                 </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className={`flex-1 transition-all duration-300 ${
          isChatOpen || isParticipantsOpen ? 'lg:mr-80' : ''
        }`}>
          <VideoGrid participants={participants} currentUserId={userId} />
        </div>

        {/* Side Panels */}
        <div className="hidden lg:flex flex-col w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          {isChatOpen && <ChatPanel />}
          {isParticipantsOpen && <ParticipantsPanel participants={participants} />}
        </div>
      </div>

      {/* Control Bar */}
             <ControlBar 
               onLeaveMeeting={handleLeaveMeeting}
               webrtcManager={webrtcManagerRef.current as any}
               onVideoToggle={handleVideoToggle}
               onAudioToggle={handleAudioToggle}
               onSendMessage={sendChatMessage}
               currentUserId={userId}
             />

      {/* Mobile Side Panels */}
      {(isChatOpen || isParticipantsOpen) && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl">
            {isChatOpen && <ChatPanel />}
            {isParticipantsOpen && <ParticipantsPanel participants={participants} />}
          </div>
        </div>
      )}
    </div>
  )
}
