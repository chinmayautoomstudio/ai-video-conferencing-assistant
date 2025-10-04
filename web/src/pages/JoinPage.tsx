import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Users, Video, Mic, MicOff, VideoOff } from 'lucide-react'
import { cn } from '../utils/cn'

export default function JoinPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [userName, setUserName] = useState('')
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [roomId, setRoomId] = useState('')

  useEffect(() => {
    const roomIdParam = searchParams.get('roomId')
    if (roomIdParam) {
      setRoomId(roomIdParam)
    }
  }, [searchParams])

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-600 rounded-full">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join Meeting
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your details to join the meeting
          </p>
        </div>

        {/* Join Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
          {/* Room ID */}
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meeting ID
            </label>
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Enter meeting ID"
              className="input-field"
            />
          </div>

          {/* User Name */}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Camera & Microphone
            </label>
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={cn(
                    "flex items-center justify-center w-16 h-16 rounded-full transition-colors duration-200 mb-2",
                    isVideoEnabled 
                      ? "bg-primary-600 hover:bg-primary-700 text-white" 
                      : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
                  )}
                >
                  {isVideoEnabled ? <Video className="w-8 h-8" /> : <VideoOff className="w-8 h-8" />}
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isVideoEnabled ? 'Camera On' : 'Camera Off'}
                </p>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className={cn(
                    "flex items-center justify-center w-16 h-16 rounded-full transition-colors duration-200 mb-2",
                    isAudioEnabled 
                      ? "bg-primary-600 hover:bg-primary-700 text-white" 
                      : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
                  )}
                >
                  {isAudioEnabled ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isAudioEnabled ? 'Microphone On' : 'Microphone Off'}
                </p>
              </div>
            </div>
          </div>

          {/* Join Button */}
          <button
            onClick={handleJoinMeeting}
            disabled={!roomId.trim()}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>Join Meeting</span>
          </button>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Tips for a great meeting:</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Test your camera and microphone before joining</li>
            <li>• Use headphones to avoid echo</li>
            <li>• Ensure good lighting for better video quality</li>
            <li>• Close unnecessary applications for better performance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
