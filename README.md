# AI Video Conference Assistant

A modern, cross-platform video conferencing application built with React (web) and React Native (mobile). This application provides real-time video and audio communication with a responsive design that works seamlessly across all platforms.

## Features

### Core Features
- **Real-time Video/Audio Communication**: WebRTC-based peer-to-peer connections
- **Multi-platform Support**: Web browsers and mobile devices (iOS/Android)
- **Responsive Design**: Adaptive layouts for desktop, tablet, and mobile
- **Room Management**: Create instant meetings, join via room ID or QR code
- **Chat & Collaboration**: Real-time messaging with file sharing
- **Participant Management**: Host controls, mute/unmute, remove participants
- **Screen Sharing**: Share your screen with other participants
- **Recording**: Local meeting recording capabilities

### Web Features
- Progressive Web App (PWA) support
- Picture-in-Picture mode
- Keyboard shortcuts
- Drag-and-drop file sharing
- Virtual backgrounds (optional)

### Mobile Features
- Native camera switching (front/rear)
- Background audio support
- Push notifications
- Haptic feedback
- Deep linking support
- QR code scanning for meeting joins

## Technology Stack

### Web Application
- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **WebRTC**: Simple-peer library
- **Build Tool**: Vite
- **PWA**: Vite PWA plugin

### Mobile Application
- **Framework**: React Native
- **WebRTC**: react-native-webrtc
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **State Management**: Zustand
- **Icons**: React Native Vector Icons

### Shared
- **Signaling**: WebSocket/Socket.io
- **Authentication**: JWT tokens
- **Real-time Communication**: WebRTC with STUN/TURN servers

## Project Structure

```
ai-video-conference-assistant/
├── web/                          # React web application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── stores/              # Zustand state management
│   │   ├── utils/               # Utility functions
│   │   └── main.tsx             # Application entry point
│   ├── public/                  # Static assets
│   └── package.json
├── mobile/                      # React Native mobile app
│   ├── src/
│   │   ├── screens/             # Screen components
│   │   ├── components/          # Reusable components
│   │   ├── utils/               # Utility functions
│   │   └── theme/               # Theme configuration
│   └── package.json
└── package.json                 # Root package.json
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- For mobile development:
  - React Native CLI
  - Android Studio (for Android)
  - Xcode (for iOS)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-video-conference-assistant
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   # Start both web and mobile
   npm run dev
   
   # Or start individually
   npm run dev:web    # Web app on http://localhost:3000
   npm run dev:mobile # React Native metro bundler
   ```

### Web Application Setup

1. **Navigate to web directory**
   ```bash
   cd web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Mobile Application Setup

1. **Navigate to mobile directory**
   ```bash
   cd mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup**
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

4. **Android Setup**
   ```bash
   npm run android
   ```

## Usage

### Web Application
1. Open your browser and navigate to `http://localhost:3000`
2. Enter your name and configure camera/microphone settings
3. Create a new meeting or join an existing one using a meeting ID
4. Use the control bar to manage your video, audio, and screen sharing
5. Access chat and participants panels from the sidebar

### Mobile Application
1. Launch the app on your device or emulator
2. Grant camera and microphone permissions when prompted
3. Enter your name and meeting details
4. Use touch gestures to navigate between video, chat, and participants
5. Use the bottom control bar for quick access to main functions

## Configuration

### WebRTC Configuration
The application uses STUN servers for NAT traversal. For production, you may need to configure TURN servers:

```typescript
// web/src/utils/webrtc.ts
export const defaultWebRTCConfig: WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:your-turn-server.com:3478', username: 'user', credential: 'pass' }
  ]
};
```

### Environment Variables
Create `.env` files in both web and mobile directories:

**web/.env**
```
VITE_SIGNALING_SERVER_URL=ws://localhost:8080
VITE_API_BASE_URL=http://localhost:3001
```

**mobile/.env**
```
SIGNALING_SERVER_URL=ws://localhost:8080
API_BASE_URL=http://localhost:3001
```

## Deployment

### Web Application
1. Build the application:
   ```bash
   cd web && npm run build
   ```

2. Deploy the `dist` folder to your hosting provider (Vercel, Netlify, etc.)

### Mobile Application
1. **Android**
   ```bash
   cd mobile && npm run build:android
   ```

2. **iOS**
   ```bash
   cd mobile && npm run build:ios
   ```

## API Integration

The application is designed to work with a signaling server for WebRTC coordination. You'll need to implement:

1. **Signaling Server**: WebSocket server for WebRTC signaling
2. **Authentication API**: User management and JWT tokens
3. **Room Management API**: Meeting room creation and management
4. **File Storage**: For chat file sharing

## Security Considerations

- **HTTPS/WSS**: Use secure connections in production
- **Permission Management**: Proper camera/microphone permission handling
- **Data Privacy**: Implement GDPR/CCPA compliance
- **End-to-End Encryption**: Consider implementing E2EE for media streams
- **Token Security**: Secure JWT token handling

## Performance Optimization

### Web
- Code splitting and lazy loading
- Service worker for offline capability
- Optimized bundle size
- Browser caching strategies

### Mobile
- Optimized re-renders with React.memo
- FlatList virtualization for long lists
- Image optimization and caching
- Memory leak prevention
- Battery usage optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## Roadmap

- [ ] Virtual backgrounds and filters
- [ ] Live transcription and closed captions
- [ ] Breakout rooms
- [ ] Whiteboard collaboration
- [ ] Calendar integration
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Advanced recording features
- [ ] AI-powered meeting insights
