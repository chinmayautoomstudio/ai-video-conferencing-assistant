Cross-Platform Video Chat SAAS Application Prompt
Create a modern, fully-functional video conferencing application that works on both web browsers and mobile devices (iOS/Android). The application should support real-time video and audio communication between multiple users with a responsive design that adapts seamlessly across all platforms.
Platform Requirements:
Web Application

React-based web application
Responsive design for desktop, tablet, and mobile browsers
Progressive Web App (PWA) capabilities for installability
Browser-based WebRTC implementation

Mobile Application

React Native for iOS and Android
Native performance and smooth animations
Mobile-optimized UI/UX patterns
Device camera and microphone integration
Background audio support
Push notifications for incoming calls

Core Features Required:
1. User Interface (Adaptive Design)
Web Layout:

Clean, modern landing page with clear call-to-action
Main video grid layout (1-12+ participants)
Sidebar navigation with collapsible panels
Desktop-optimized control bar at bottom
Floating action buttons for quick access
Picture-in-Picture mode support

Mobile Layout:

Touch-optimized interface with larger tap targets
Swipeable panels for chat and participants
Portrait and landscape orientation support
Full-screen video mode
Bottom sheet for controls and options
Native-feeling navigation (tab bar or drawer)
Gesture controls (swipe to switch views, pinch to zoom)

Common Elements:

Participant video tiles with names
Active speaker highlighting
Connection quality indicators
Visual feedback for all interactions
Loading states and error messages

2. Video/Audio Functionality
Web:

WebRTC for peer-to-peer connections
MediaStream API for camera/microphone access
Screen sharing via getDisplayMedia API
Audio output device selection
Virtual backgrounds (optional)

Mobile:

React Native WebRTC library integration
Native camera switching (front/rear)
Audio routing (speaker/earpiece/bluetooth)
Background audio continuation
Proximity sensor integration (turn off screen during audio-only)
Screen sharing from device (iOS/Android specific APIs)

Common Features:

Real-time video/audio streaming
Toggle video on/off with placeholder avatar
Toggle audio mute/unmute
Adaptive bitrate based on connection quality
Echo cancellation and noise suppression
Dominant speaker detection
Grid and spotlight layout modes

3. Room Management

Create instant meeting rooms with unique IDs
Join via room ID, shareable link, or QR code (mobile)
Waiting room functionality
Host controls (mute participants, remove users)
Lock/unlock room
Meeting passwords (optional)
Recording functionality (local or cloud)
Schedule meetings with calendar integration

4. Chat & Collaboration
Web:

Sidebar chat panel with full message history
File sharing with drag-and-drop
Emoji reactions
Typing indicators

Mobile:

Bottom sheet or full-screen chat view
Native keyboard handling
Image/file sharing from device gallery
Voice messages
Push notifications for messages while minimized

Common Features:

Real-time text messaging
Message read receipts
Message timestamps
User mentions (@username)
Chat history persistence

5. Participant Management

Real-time participant list
Participant status (video on/off, audio muted)
Raise hand feature
User profiles with avatars
Admin/moderator roles
Admit from waiting room
Kick/ban participants (host only)

6. Authentication & User Management

Guest access (no account required)
User registration and login
Profile management (name, avatar, settings)
Meeting history
Contact list / favorites
OAuth integration (Google, Microsoft, Apple)

7. Settings & Preferences
Web:

Audio/video device selection
Video quality settings
Bandwidth usage controls
Keyboard shortcuts
Theme selection (light/dark mode)

Mobile:

Native settings screen
Data saver mode
Notification preferences
Cellular data controls
Storage management
Permission management

8. Technical Requirements
Web Stack:

React 18+ with Hooks
WebRTC for real-time communication
WebSocket or SignalR for signaling
Tailwind CSS for styling
Zustand or Redux for state management
React Router for navigation

Mobile Stack:

React Native (latest stable version)
React Native WebRTC library
React Navigation for routing
Native modules for camera/audio
AsyncStorage for local data
Push notifications (FCM/APNS)
Deep linking support

Shared/Common:

TypeScript for type safety (optional but recommended)
REST API or GraphQL for backend communication
JWT authentication
Real-time signaling server (WebSocket/Socket.io)
STUN/TURN servers for NAT traversal

9. Performance Optimization
Web:

Code splitting and lazy loading
Service worker for offline capability
Optimized bundle size
Browser caching strategies

Mobile:

Optimized re-renders with React.memo
FlatList virtualization for long lists
Image optimization and caching
Memory leak prevention
Battery usage optimization

10. Security & Privacy

End-to-end encryption (E2EE) for media streams
Secure WebSocket connections (WSS)
Token-based authentication
Permission management (camera/mic access)
Data privacy compliance (GDPR, CCPA)
Secure meeting links with expiration
Screenshot prevention (mobile)

User Flows:
Web User Flow:

Land on homepage → Create/Join meeting
Browser requests camera/mic permissions
Enter meeting room with video grid
Access controls via bottom toolbar
Use sidebars for chat and participants
Leave meeting with confirmation dialog

Mobile User Flow:

Open app → Login or continue as guest
Create/Join meeting or scan QR code
Grant camera/mic permissions (system dialog)
Enter meeting with optimized mobile layout
Swipe between video, chat, and participants
Use bottom sheet for controls
Picture-in-Picture when minimized
Hang up with confirmation

Design Specifications:
Visual Design:

Modern, professional color palette
Dark mode support with auto-detection
Consistent design system across platforms
Platform-specific UI patterns (Material Design for Android, iOS Human Interface Guidelines)
Accessibility: WCAG 2.1 AA compliance, screen reader support

Responsive Breakpoints (Web):

Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
Large Desktop: > 1440px

Mobile Considerations:

Safe area handling (notches, home indicators)
Haptic feedback for interactions
Native sharing capabilities
Deep linking for easy meeting joins
App icon and splash screen

Deliverables:
For Web Application:
A React artifact (application/vnd.ant.react) with:

Complete responsive video chat interface
All UI components and controls
WebRTC implementation or simulation
Mobile-responsive design
Professional styling with Tailwind CSS

For Mobile Application:
A React Native code artifact (application/vnd.ant.code, language="javascript" or language="typescript") with:

Complete mobile app structure
Navigation setup
Video chat screens and components
Mobile-optimized controls and gestures
Platform-specific implementations noted

Documentation:

Setup instructions for both platforms
Environment configuration
API integration guidelines
Deployment instructions

Additional Features (Optional):

Virtual backgrounds and filters
Live transcription and closed captions
Recording and playback
Polls and Q&A
Breakout rooms
Whiteboard collaboration
Calendar integration
Analytics dashboard
Multi-language support


Please create a production-ready, cross-platform video conferencing application that demonstrates these features with clean, maintainable code. Start with either the web or mobile version, with architecture that allows for shared business logic and consistent user experience across both platforms.