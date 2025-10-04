# Setup Guide - AI Video Conference Assistant

This guide will help you set up and run the AI Video Conference Assistant application on your local development environment.

## Prerequisites

### Required Software
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Git**: For cloning the repository

### For Mobile Development (Optional)
- **React Native CLI**: `npm install -g react-native-cli`
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)
- **Java Development Kit (JDK)**: Version 11 or higher

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-video-conference-assistant
```

### 2. Install All Dependencies
```bash
npm run install:all
```

### 3. Start Development Servers
```bash
# Start both web and mobile development servers
npm run dev

# Or start them individually:
npm run dev:web    # Web app only
npm run dev:mobile # Mobile metro bundler only
```

## Detailed Setup

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
   The web application will be available at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

### Mobile Application Setup

#### Prerequisites for Mobile Development

**For Android:**
1. Install Android Studio
2. Set up Android SDK and emulator
3. Configure environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

**For iOS (macOS only):**
1. Install Xcode from App Store
2. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
3. Install CocoaPods:
   ```bash
   sudo gem install cocoapods
   ```

#### Mobile Setup Steps

1. **Navigate to mobile directory**
   ```bash
   cd mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup (macOS only)**
   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

4. **Android Setup**
   ```bash
   npm run android
   ```

## Environment Configuration

### Web Application Environment

Create a `.env` file in the `web` directory:

```env
# Web Application Environment Variables
VITE_SIGNALING_SERVER_URL=ws://localhost:8080
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=AI Video Conference
VITE_APP_VERSION=1.0.0
```

### Mobile Application Environment

Create a `.env` file in the `mobile` directory:

```env
# Mobile Application Environment Variables
SIGNALING_SERVER_URL=ws://localhost:8080
API_BASE_URL=http://localhost:3001
APP_NAME=AI Video Conference
APP_VERSION=1.0.0
```

## Development Workflow

### Running the Application

1. **Start the web application:**
   ```bash
   cd web
   npm run dev
   ```

2. **Start the mobile development server:**
   ```bash
   cd mobile
   npm run start
   ```

3. **Run on Android:**
   ```bash
   cd mobile
   npm run android
   ```

4. **Run on iOS:**
   ```bash
   cd mobile
   npm run ios
   ```

### Building for Production

1. **Build web application:**
   ```bash
   cd web
   npm run build
   ```

2. **Build Android APK:**
   ```bash
   cd mobile
   npm run build:android
   ```

3. **Build iOS app:**
   ```bash
   cd mobile
   npm run build:ios
   ```

## Troubleshooting

### Common Issues

#### Web Application Issues

**Port already in use:**
```bash
# Kill process using port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- --port 3001
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Mobile Application Issues

**Metro bundler issues:**
```bash
# Clear Metro cache
npx react-native start --reset-cache
```

**Android build issues:**
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

**iOS build issues:**
```bash
# Clean iOS build
cd ios
rm -rf build
pod install
cd ..
```

**Permission issues (Android):**
- Ensure camera and microphone permissions are granted in device settings
- Check AndroidManifest.xml for required permissions

**Permission issues (iOS):**
- Add camera and microphone usage descriptions in Info.plist
- Grant permissions when prompted in the app

### WebRTC Issues

**Camera/Microphone not working:**
1. Ensure HTTPS is used in production (required for WebRTC)
2. Check browser permissions for camera and microphone
3. Verify device has working camera and microphone

**Connection issues:**
1. Check firewall settings
2. Verify STUN/TURN server configuration
3. Test with different network connections

## Testing

### Web Application Testing
```bash
cd web
npm run test
```

### Mobile Application Testing
```bash
cd mobile
npm run test
```

## Code Quality

### Linting
```bash
# Web application
cd web
npm run lint

# Mobile application
cd mobile
npm run lint
```

### Type Checking
```bash
# Web application
cd web
npx tsc --noEmit

# Mobile application
cd mobile
npx tsc --noEmit
```

## Deployment

### Web Application Deployment

**Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in the web directory
3. Follow the prompts

**Netlify:**
1. Build the app: `npm run build`
2. Drag the `dist` folder to Netlify dashboard

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Mobile Application Deployment

**Android:**
1. Generate signed APK: `npm run build:android`
2. Upload to Google Play Console

**iOS:**
1. Build for App Store: `npm run build:ios`
2. Upload to App Store Connect

## Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [WebRTC Documentation](https://webrtc.org/getting-started/overview)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started)

## Support

If you encounter any issues during setup:

1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all prerequisites are installed correctly
4. Create an issue in the repository with detailed error information

## Next Steps

After successful setup:

1. Explore the application features
2. Customize the UI and functionality
3. Integrate with your backend services
4. Deploy to production
5. Set up monitoring and analytics
