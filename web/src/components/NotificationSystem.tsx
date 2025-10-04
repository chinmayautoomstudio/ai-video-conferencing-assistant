import { useState, useEffect } from 'react'
import { X, UserPlus, UserMinus } from 'lucide-react'

export interface Notification {
  id: string
  type: 'join' | 'leave'
  userName: string
  timestamp: Date
}

interface NotificationSystemProps {
  notifications: Notification[]
  onRemoveNotification: (id: string) => void
}

export default function NotificationSystem({ notifications, onRemoveNotification }: NotificationSystemProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1]
      setVisibleNotifications(prev => [...prev, latestNotification])
      
      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setVisibleNotifications(prev => prev.filter(n => n.id !== latestNotification.id))
        onRemoveNotification(latestNotification.id)
      }, 5000)
    }
  }, [notifications, onRemoveNotification])

  const handleRemoveNotification = (id: string) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id))
    onRemoveNotification(id)
  }

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-80 max-w-96 animate-in slide-in-from-right duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                notification.type === 'join' 
                  ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                  : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
              }`}>
                {notification.type === 'join' ? (
                  <UserPlus className="w-5 h-5" />
                ) : (
                  <UserMinus className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.userName} {notification.type === 'join' ? 'joined' : 'left'} the meeting
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRemoveNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
