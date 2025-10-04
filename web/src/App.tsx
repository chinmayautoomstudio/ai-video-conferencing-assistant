import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useThemeStore } from './stores/themeStore'
import HomePage from './pages/HomePage'
import MeetingPage from './pages/MeetingPage'
import JoinPage from './pages/JoinPage'
import Layout from './components/Layout'

function App() {
  const { isDark, initializeTheme } = useThemeStore()

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="join" element={<JoinPage />} />
          <Route path="meeting/:roomId" element={<MeetingPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
