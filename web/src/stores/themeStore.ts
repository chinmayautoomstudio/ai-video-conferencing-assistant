import { create } from 'zustand'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
  initializeTheme: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
  setTheme: (isDark: boolean) => set({ isDark }),
  initializeTheme: () => {
    try {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        set({ isDark: savedTheme === 'dark' })
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        set({ isDark: prefersDark })
      }
    } catch (error) {
      console.warn('Failed to initialize theme:', error)
      set({ isDark: false })
    }
  }
}))
