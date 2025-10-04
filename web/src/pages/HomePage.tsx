import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video, Users, Mic, MicOff, VideoOff, Settings, ArrowRight, Copy, Check } from 'lucide-react'
import { generateRoomId } from '../utils/webrtc'
import { cn } from '../utils/cn'
import AudioLevelIndicator from '../components/AudioLevelIndicator'
import CameraTest from '../components/CameraTest'

export default function HomePage() {
  const navigate = useNavigate()
  const [roomId, setRoomId] = useState('')
  const [userName, setUserName] = useState('')
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [copied, setCopied] = useState(false)
  const [testStream, setTestStream] = useState<MediaStream | null>(null)
  const [isTestingMic, setIsTestingMic] = useState(false)

  const handleCreateMeeting = () => {
    const newRoomId = generateRoomId()
    navigate(`/meeting/${newRoomId}`, { 
      state: { 
        userName: userName || 'Anonymous User',
        isHost: true,
        isVideoEnabled,
        isAudioEnabled
      }
    })
  }

  const handleJoinMeeting = () => {
    if (roomId.trim()) {
      navigate(`/meeting/${roomId.trim()}`, {
        state: {
          userName: userName || 'Anonymous User',
          isHost: false,
          isVideoEnabled,
          isAudioEnabled
        }
      })
    }
  }

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const testMicrophone = async () => {
    if (isTestingMic) {
      // Stop testing
      if (testStream) {
        testStream.getTracks().forEach(track => track.stop())
        setTestStream(null)
      }
      setIsTestingMic(false)
      return
    }

    try {
      setIsTestingMic(true)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      })
      setTestStream(stream)
    } catch (error) {
      console.error('Failed to access microphone:', error)
      alert('Failed to access microphone. Please check your permissions.')
      setIsTestingMic(false)
    }
  }

  // Cleanup test stream on unmount
  useEffect(() => {
    return () => {
      if (testStream) {
        testStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [testStream])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-600 rounded-full">
              <Video className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Video Conference
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connect with anyone, anywhere, anytime
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
          {/* User Name Input */}
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="input-field"
            />
          </div>

          {/* Media Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200",
                isVideoEnabled 
                  ? "bg-primary-600 hover:bg-primary-700 text-white" 
                  : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
              )}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200",
                isAudioEnabled 
                  ? "bg-primary-600 hover:bg-primary-700 text-white" 
                  : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
              )}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
          </div>

          {/* Camera Test */}
          {isVideoEnabled && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-900 dark:text-green-100 mb-3">
                Camera Preview
              </h3>
              <CameraTest />
            </div>
          )}

          {/* Microphone Test */}
          {isAudioEnabled && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Test Microphone
                </h3>
                <button
                  onClick={testMicrophone}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200",
                    isTestingMic
                      ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
                  )}
                >
                  {isTestingMic ? 'Stop Test' : 'Test Mic'}
                </button>
              </div>
              
              {isTestingMic && testStream && (
                <div className="space-y-2">
                  <AudioLevelIndicator 
                    stream={testStream} 
                    isAudioEnabled={true}
                    className="text-blue-800 dark:text-blue-200"
                  />
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Speak into your microphone to see the audio levels
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Room ID Input */}
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meeting ID
            </label>
            <div className="relative">
              <input
                id="roomId"
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Enter meeting ID"
                className="input-field pr-12"
              />
              {roomId && (
                <button
                  onClick={copyRoomId}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleJoinMeeting}
              disabled={!roomId.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Join Meeting</span>
            </button>
            
            <button
              onClick={handleCreateMeeting}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Video className="w-5 h-5" />
              <span>Start New Meeting</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <Video className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">HD Video</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Crystal clear quality</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Multi-User</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Up to 12 participants</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <Settings className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-white">Easy Setup</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">No downloads required</p>
          </div>
        </div>
      </div>
    </div>
  )
}
